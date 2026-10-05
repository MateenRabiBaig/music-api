import { searchJioSaavn } from "../providers/jiosaavn/jiosaavn.provider.js";
import { searchGaana } from "../providers/gaana/gaana.provider.js";
import { searchVerome } from "../providers/verome/verome.provider.js";

export async function searchSong(query: string) {
  // 1. JioSaavn
  try {
    const jioResults = await searchJioSaavn(query);

    if (jioResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "jiosaavn",
        results: jioResults,
      };
    }
  } catch (error) {
    console.error("JioSaavn search failed:", error);
  }

  // 2. Gaana
  try {
    const gaanaResults = await searchGaana(query);

    if (gaanaResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "gaana",
        results: gaanaResults,
      };
    }
  } catch (error) {
    console.error("Gaana search failed:", error);
  }

  // 3. Verome
  try {
    const veromeResults = await searchVerome(query);

    if (veromeResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "verome",
        results: veromeResults,
      };
    }
  } catch (error) {
    console.error("Verome search failed:", error);
  }

  // Nothing found
  return {
    success: true,
    found: false,
    provider: null,
    results: [],
  };
}