import assert from "node:assert/strict";
import { inferCategory } from "../src/lib/catalog-utils.ts";

assert.equal(inferCategory("demo.py"), "Code");
assert.equal(inferCategory("deck.pptx"), "Presentations");
assert.equal(inferCategory("notes.pdf"), "Documents");
assert.equal(inferCategory("image.png"), "Graphics");
assert.equal(inferCategory("tool.app"), "Applications");
assert.equal(inferCategory("custom-file"), "Code");

console.log("catalog-utils tests passed");
