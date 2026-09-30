export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    image: string | null;
    duration: string | null;
    source: "jiosaavn" | "gaana" | "verome";
    url: string | null;
}

export interface SearchResult {
    provider: "jiosaavn" | "gaana" | "verome";
    results: Song[];
}