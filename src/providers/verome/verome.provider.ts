import type { VeromeSong } from "./verome.types.js";

const VEROME_API_SONG = process.env.VEROME_API_SONG ?? "http://localhost:8000";

interface VeromeSearchItem {
    videoId?: string;
    title?: string;
    artist?: string;
    artists?: Array<{
        name?: string
    }>;
    album?: { name?: string; } | string;
    duration?: string | number;
    duration_seconds?: number;
    thumbnails?: Array<{ url?: string; }>;
}

function normalizeSong(item: VeromeSearchItem): VeromeSong | null {
    if(!item.title) {
        return null;
    }

    const duration = item.duration_seconds ?? (typeof item.duration === "number" ? item.duration : Number(item.duration));
    const artist = item.artist ?? item.artists?.map((artist)=>artist.name).filter(Boolean).join(", ") ?? "Unkown Artist";
    const album = typeof item.album === "string" ? item.album : item.album?.name ?? "";
    const image = item.thumbnails?.at(-1)?.url ?? null;

    return {
        id: item.videoId ?? item.title,
        title: item.title,
        artist,
        album,
        duration: Number.isFinite(duration) ? duration : null,
        image,
        videoId: item.videoId ?? null
    }
}

export async function searchVerome(query: string) : Promise<VeromeSong[]> {
    const url = new URL(`${VEROME_API_SONG}/api/search`);
    url.searchParams.set("q",query);

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000)
    });

    if(!response.ok) {
        throw new Error(`Verome returned HTTP ${response.status}`);
    }

    const data = await response.json();

    const items : VeromeSearchItem[] = Array.isArray(data) ? data : data.results ?? data.songs ?? data.data ?? [];

    return items.map(normalizeSong).filter((song): song is VeromeSong => song!==null);
}