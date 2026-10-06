import { searchJioSaavn } from "../providers/jiosaavn/jiosaavn.provider.js";
import { searchGaana } from "../providers/gaana/gaana.provider.js";
import { searchVerome } from "../providers/verome/verome.provider.js";
import { isGoodSongMatch } from "../utils/song-matcher.js";

export async function searchSong(query: string) {
  // 1. JioSaavn
  try {
    const jioResults = await searchJioSaavn(query);

    const matchedResults = jioResults.filter((song) =>
      isGoodSongMatch(query, song.title)
    );

    if (matchedResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "jiosaavn",
        results: matchedResults,
      };
    }
  } catch (error) {
    console.error("JioSaavn search failed:", error);
  }

  // 2. Gaana
  try {
    const gaanaResults = await searchGaana(query);

    const matchedResults = gaanaResults.filter((song) =>
      isGoodSongMatch(query, song.title)
    );

    if (matchedResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "gaana",
        results: matchedResults,
      };
    }
  } catch (error) {
    console.error("Gaana search failed:", error);
  }

  // 3. Verome
  try {
    const veromeResults = await searchVerome(query);

    const matchedResults = veromeResults.filter((song) =>
      isGoodSongMatch(query, song.title)
    );

    if (matchedResults.length > 0) {
      return {
        success: true,
        found: true,
        provider: "verome",
        results: matchedResults,
      };
    }
  } catch (error) {
    console.error("Verome search failed:", error);
  }

  return {
    success: true,
    found: false,
    provider: null,
    results: [],
  };
}