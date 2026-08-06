export type NebulaWalletBundle = {
  nebulaId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

function chunkBase64(value: string) {
  return value.match(/.{1,64}/g)?.join("\n") ?? value;
}

function pemFromBuffer(label: string, buffer: ArrayBuffer) {
  const base64 = chunkBase64(arrayBufferToBase64(buffer));
  return `-----BEGIN ${label}-----\n${base64}\n-----END ${label}-----`;
}

function bufferFromPem(pem: string) {
  const base64 = pem.replace(/-----BEGIN [^-]+-----/g, "").replace(/-----END [^-]+-----/g, "").replace(/\s+/g, "");
  return base64ToArrayBuffer(base64);
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getSubtleCrypto() {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Browser wallet crypto is unavailable. Open the app at http://localhost:3000 or use HTTPS.");
  }

  return window.crypto.subtle;
}

export async function deriveNebulaId(publicKeyPem: string) {
  const digest = await getSubtleCrypto().digest("SHA-256", new TextEncoder().encode(publicKeyPem));
  return `nebula_${toHex(digest).slice(0, 12)}`;
}

export async function generateNebulaWallet(): Promise<NebulaWalletBundle> {
  const keyPair = await getSubtleCrypto().generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );

  const [publicKeyBuffer, privateKeyBuffer] = await Promise.all([
    getSubtleCrypto().exportKey("spki", keyPair.publicKey),
    getSubtleCrypto().exportKey("pkcs8", keyPair.privateKey),
  ]);

  const publicKeyPem = pemFromBuffer("PUBLIC KEY", publicKeyBuffer);
  const privateKeyPem = pemFromBuffer("PRIVATE KEY", privateKeyBuffer);
  const nebulaId = await deriveNebulaId(publicKeyPem);

  return {
    nebulaId,
    publicKeyPem,
    privateKeyPem,
  };
}

export async function importNebulaVault(privateKeyPem: string): Promise<NebulaWalletBundle> {
  const subtle = getSubtleCrypto();
  const privateKey = await subtle.importKey(
    "pkcs8",
    bufferFromPem(privateKeyPem),
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );

  const jwk = await subtle.exportKey("jwk", privateKey);
  if (!jwk.n || !jwk.e) {
    throw new Error("Vault import failed. The private key is missing public key parameters.");
  }

  const publicKey = await subtle.importKey(
    "jwk",
    {
      kty: "RSA",
      n: jwk.n,
      e: jwk.e,
      alg: "PS256",
      ext: true,
      key_ops: ["verify"],
    },
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["verify"],
  );

  const publicKeyBuffer = await subtle.exportKey("spki", publicKey);
  const publicKeyPem = pemFromBuffer("PUBLIC KEY", publicKeyBuffer);
  const nebulaId = await deriveNebulaId(publicKeyPem);

  return {
    nebulaId,
    publicKeyPem,
    privateKeyPem,
  };
}

export function downloadNebulaVault(privateKeyPem: string) {
  const blob = new Blob([privateKeyPem], { type: "application/x-pem-file" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "nebula_vault.pem";
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function hashFile(file: File) {
  const buffer = await file.arrayBuffer();
  const digest = await getSubtleCrypto().digest("SHA-256", buffer);
  return toHex(digest);
}

export async function signFileHash(privateKeyPem: string, fileHash: string) {
  const subtle = getSubtleCrypto();
  const privateKey = await subtle.importKey(
    "pkcs8",
    bufferFromPem(privateKeyPem),
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signature = await subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32,
    },
    privateKey,
    new TextEncoder().encode(fileHash),
  );

  return toHex(signature);
}
