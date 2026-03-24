export function formatWebsiteUrlToCompanyName(url: string): string {
  // Extract domain (before first /), strip protocol/www
  const domain = url
      .replace(/^https?:\/\//i, "")      // Remove http://, https://
      .replace(/^www\./i, "")           // Remove www.
      .split("/")[0];                   // Take before first /

  // Keep letters only, up to first dot
  return domain.replace(/^([A-Za-z]+(?:[A-Za-z]*[A-Za-z])?)\..*$/, "$1");
}