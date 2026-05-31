import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

describe("download image asset loading", () => {
  it("loads the centered-text renderer with its current cache key", async () => {
    const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

    assert.match(html, /<script src="script\.js\?v=download-align-2"><\/script>/);
  });

  it("centers each wrapped download-image text line before drawing", async () => {
    const script = await readFile(new URL("../script.js", import.meta.url), "utf8");
    const drawCenteredText = script.slice(
      script.indexOf("const drawCenteredText"),
      script.indexOf("const drawPixelHeart"),
    );

    assert.match(
      drawCenteredText,
      /exportCtx\.save\(\);\s+exportCtx\.textAlign = "center";\s+exportCtx\.textBaseline = "top";/,
    );
    assert.match(
      drawCenteredText,
      /exportCtx\.fillText\(textLine, x, y \+ index \* lineHeight\);/,
    );
  });
});
