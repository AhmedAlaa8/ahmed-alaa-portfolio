import { portfolioContent, links } from "../data/portfolio-content.mjs";
/** Content boundary: UI depends on this contract, not on the storage format. */
export function createPortfolioRepository(
  source = portfolioContent,
  contactLinks = links,
) {
  const supported = Object.freeze(Object.keys(source));
  const resolveLocale = (value) => (supported.includes(value) ? value : supported.includes("en") ? "en" : supported[0]);
  return Object.freeze({
    getSupportedLocales: () => supported,
    resolveLocale,
    getContent: (locale) => source[resolveLocale(locale)],
    getProjects: (locale) => source[resolveLocale(locale)].projects,
    getLinks: () => contactLinks,
  });
}
export const portfolioRepository = createPortfolioRepository();
