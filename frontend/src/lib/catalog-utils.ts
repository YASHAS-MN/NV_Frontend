export function inferCategory(assetName: string) {
  const lower = assetName.toLowerCase();

  if (lower.endsWith(".py") || lower.endsWith(".js") || lower.endsWith(".ts") || lower.endsWith(".sol")) {
    return "Code";
  }

  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) {
    return "Presentations";
  }

  if (lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx")) {
    return "Documents";
  }

  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".svg")) {
    return "Graphics";
  }

  if (lower.endsWith(".exe") || lower.endsWith(".app")) {
    return "Applications";
  }

  return "Code";
}
