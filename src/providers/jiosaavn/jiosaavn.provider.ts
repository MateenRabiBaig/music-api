import type { Song } from "./jiosaavn.types.js";

const JIOSAAVN_API = "https://www.jiosaavn.com/api.php";

interface JioSong {
    id?: string;
    title?: string;
    song?: string;
    subtitle?: string;
    primary_artists?: string;
    singers?: string;
    album?: string | { name?: string };
    image?: string | Array<{ quality?: string; link?: string }>;
    duration?: string | number;
    perma_url?: string;
    url?: string;
}

interface JioSearchResponse {
    songs?: {
        data?: JioSong[];
    }
}

function getImage(image: JioSong["image"]): string | null {
    if(typeof image === "string") {
        return image || null;
    }

    if(Array.isArray(image)) {
        return (image.find((item) => item.quality === "500x500")?.link ?? image.at(-1)?.link ?? null);
    }
    return null;
}

function normalizeSong(song: JioSong): Song | null {
    const title = song.title ?? song.song;

    if(!song.id || !title) {
        return null;
    }

    const album = typeof song.album === "string" ? song.album : song.album?.name ?? "";

    const duration = Number(song.duration);

    return {
        id: song.id,
        title,
        artist: song.primary_artists ?? song.singers ?? song.subtitle ?? "Unknown artist",
        album,
        image: getImage(song.image),
        duration: Number.isFinite(duration) ? duration : null,
        source: "jiosaavn",
        url: null
    }
}

export async function searchJioSaavn(query: string): Promise<Song[]> {
    const url = new URL(JIOSAAVN_API);
    url.search = new URLSearchParams({
        __call: "autocomplete.get",
        _format: "json",
        _marker: "0",
        cc: "in",
        includeMetaTags: "1",
        query,
    }).toString();

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "Application/json"
        },
        signal: AbortSignal.timeout(8000),
    });

    if(!response.ok) {
        throw new Error(`JioSaavn returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as JioSearchResponse;
    const songs = data.songs?.data ?? [];
    return songs.map(normalizeSong).filter((song): song is Song => song!==null)
}
interface JioSongDetails {
  id?: string;
  title?: string;
  song?: string;
  singers?: string;
  primary_artists?: string;
  album?: string | { name?: string; };
  image?: string | Array<{ quality?: string; link?: string; }>;
  duration?: string | number;
  language?: string;
  year?: string | number;
  perma_url?: string;
  url?: string;
}
interface JioSongDetailsResponse {
  [songId: string]: JioSongDetails;
}

export async function getJioSaavnSong(songId: string): Promise<JioSongDetails | null> {
  const url = new URL(JIOSAAVN_API);

  url.search = new URLSearchParams({
    __call: "song.getDetails",
    cc: "in",
    _marker: "0",
    _format: "json",
    pids: songId,
  }).toString();

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`JioSaavn song details returned HTTP ${response.status}`);
  }

  const data = (await response.json()) as JioSongDetailsResponse;
  const song = data[songId];

  if (!song) {
    return null;
  }

  const title = song.title ?? song.song;

  if (!title) {
    return null;
  }

  const album = typeof song.album === "string" ? song.album : song.album?.name ?? "";
  const duration = Number(song.duration);

  let image: string | null = null;

  if (typeof song.image === "string") {
    image = song.image;
  }
  else if (Array.isArray(song.image)) {
    image = song.image.find((item) => item.quality === "500x500")?.link ?? song.image.at(-1)?.link ?? null;
  }

  return {
    id: songId,
    title,
    artist: song.primary_artists ?? song.singers ?? "Unknown artist",
    album,
    image,
    duration: Number.isFinite(duration) ? duration : null,
    language: song.language ?? null,
    year: song.year !== undefined ? String(song.year) : null,
    providerUrl: song.perma_url ?? null,
    playbackUrl: song.url ?? null,
  };
}