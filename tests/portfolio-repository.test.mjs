import test from "node:test";
import assert from "node:assert/strict";
import {
  portfolioRepository,
  createPortfolioRepository,
} from "../repositories/portfolio-repository.mjs";
function paths(value, prefix = "") {
  return Object.entries(value).flatMap(([key, item]) => {
    const path = prefix + "." + key;
    return item && typeof item === "object" ? paths(item, path) : [path];
  });
}
test("Both languages provide the same complete content contract", () => {
  const en = portfolioRepository.getContent("en");
  const ar = portfolioRepository.getContent("ar");
  assert.deepEqual(paths(ar), paths(en));
  for (const locale of ["en", "ar"]) {
    const content = portfolioRepository.getContent(locale);
    function verify(v) {
      for (const x of Object.values(v)) {
        if (x && typeof x === "object") verify(x);
        else assert.equal(typeof x === "string" && x.trim().length > 0, true);
      }
    }
    verify(content);
  }
});
test("Unknown or missing stored language falls back to English", () => {
  for (const locale of [null, undefined, "", "fr", "__proto__"]) {
    assert.equal(portfolioRepository.resolveLocale(locale), "en");
    assert.equal(
      portfolioRepository.getContent(locale),
      portfolioRepository.getContent("en"),
    );
  }
});
test("Switching locale preserves selected project identity and all five work areas", () => {
  assert.deepEqual(
    portfolioRepository.getProjects("en").map((p) => [p.id, p.art]),
    portfolioRepository.getProjects("ar").map((p) => [p.id, p.art]),
  );
  assert.equal(portfolioRepository.getProjects("ar").length, 5);
});
test("Repository can read an alternate source without coupling UI to the content file", () => {
  const source = {
    en: { projects: [], name: "Test" },
    ar: { projects: [], name: "اختبار" },
  };
  const repo = createPortfolioRepository(source, {
    linkedin: "https://example.com",
  });
  assert.equal(repo.getContent("ar").name, "اختبار");
  assert.equal(repo.getLinks().linkedin, "https://example.com");
});
