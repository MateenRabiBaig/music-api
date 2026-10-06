function normalizeText(value: string): string {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, "").trim();
}

function tokenize(value: string): string[] {
    return normalizeText(value).split(" ").filter(Boolean);
}

function calculateTitleScore(query: string, title: string): number {
    const normalizedQuery = normalizeText(query);
    const normalizedTitle = normalizeText(title);

    if(!normalizedQuery || !normalizedTitle) {
        return 0;
    }

    if(normalizedQuery === normalizedTitle) {
        return 1;
    }

    if(normalizedTitle.includes(normalizedQuery)) {
        return 0.9;
    }

    const queryTokens = tokenize(query);
    const titleTokens = new Set(tokenize(title));

    if(queryTokens.length === 0) {
        return 0;
    }

    const matchedTokens = queryTokens.filter((token) => titleTokens.has(token));

    return matchedTokens.length / queryTokens.length;
}

export function isGoodSongMatch(query: string, title: string): boolean {
    const score = calculateTitleScore(query, title);
    return score >= 0.8;
}