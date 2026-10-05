import type { GaanaSong } from "./gaana.types.js";

const GAANA_SEARCH_URL = "https://gaana.com/search/songs";

interface GaanaSearchItem {
    seokey?: string;
    track_id?: string;
    trackId?: string;
    title?: string;
    artists?: string;
    artist?: string;
    album?: string;
    album_title?: string;
    duration?: string | number;
    language?: string;
    image?: string;
    artwork?: string;
    artworkUrl?: string;
    song_url?: string;
}

interface GaanaSearchResponse {
    songs?: GaanaSearchItem[];
    data?: GaanaSearchItem[];
}

function normalizeSong(song: GaanaSearchItem): GaanaSong | null {
    const title = song.title ?? song.track_title;
    
    if(!title || !song.seokey) {
        return null;
    }

    const duration = Number(song.duration);

    return {
        seokey: song.seokey,
        trackId: song.track_id ?? song.trackId ?? null,
        title,
        artist: song.artists ?? song.artist ?? "Unknown artist",
        album: song.album ?? song.album_title ?? "",
        duration: Number.isFinite(duration) ? duration : null,
        language: song.language ?? null,
        image: song.artworkUrl ?? song.artwork ?? song.image ?? null,
        songUrl: song.song_url ?? `https://gaana.com/song/${song.seokey}`
    }
}

export async function searchGaana(query: string): Promise<GaanaSong[]> {
    const url = new URL(GAANA_SEARCH_URL);
    url.pathname += `/${encodeURIComponent(query)}`
    const response = await fetch(url, {
        headers: {
            "User-Agent": "MOzilla/5.0",
            Accept: "text/html,application/json"
        },
        signal: AbortSignal.timeout(8000)
    })

    if(!response.ok) {
        throw new Error(`Gaana returned HTTP ${response.status}`)
    }

    const contentType = response.headers.get("content-type") ?? "";
    if(!contentType.includes("application/json")) {
        return [];
    }

    const data = (await response.json()) as GaanaSearchResponse;

    const songs = data.songs ?? data.data ?? [];

    return songs.map(normalizeSong).filter((song): song is GaanaSong => song!==null)
}