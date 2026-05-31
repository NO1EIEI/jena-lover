import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

describe("responsive quiz layout", () => {
  it("loads the lowered mobile quiz layout with its current cache key", async () => {
    const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

    assert.match(html, /<link rel="stylesheet" href="styles\.css\?v=responsive-quiz-lower-3" \/>/);
  });

  it("places the mobile question box slightly lower", async () => {
    const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
    const mobileStyles = styles.slice(
      styles.indexOf("@media (max-width: 780px)"),
      styles.indexOf("@media (prefers-reduced-motion: reduce)"),
    );

    assert.match(
      mobileStyles,
      /\.season-card\s*{\s*padding: 14px 18px;\s*width: 100%;\s*margin-top: 0;\s*}/,
    );
    assert.match(
      mobileStyles,
      /\.quiz-layout\s*{\s*align-content: end;\s*padding-bottom: clamp\(60px, 12vh, 120px\);\s*}/,
    );
  });
});

