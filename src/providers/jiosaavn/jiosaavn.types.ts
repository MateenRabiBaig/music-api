export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    image: string | null;
    duration: string | null;
    provider: "jiosaavn" | "gaana" | "verome";
    providerId: string;
    providerUrl: string | null;
    url: string | null;
}

export interface JioSaavnSongDetails {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  duration: number | null;
  language: string | null;
  year: string | null;
  providerUrl: string | null;
  playbackUrl: string | null;
}

export interface SearchResult {
    provider: "jiosaavn" | "gaana" | "verome";
    results: Song[];
}