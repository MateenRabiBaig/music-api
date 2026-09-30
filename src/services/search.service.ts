import { searchJioSaavn } from "../providers/jiosaavn/jiosaavn.provider.js";

export async function searchSong(query: string) {
    const jioResults = await searchJioSaavn(query);

    if(jioResults.length > 0) {
        return {
            success: true,
            found: true,
            provider: "jiosaavn",
            results: jioResults
        }
    }

    return {
        success: true,
        found: false,
        provider: null,
        results: []
    }
}