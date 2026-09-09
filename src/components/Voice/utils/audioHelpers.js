// ==========================================================
// Audio Helper Functions
// ==========================================================

export function createAudioURL(blob) {

    if (!blob) return null;

    return URL.createObjectURL(blob);

}

export function revokeAudioURL(url) {

    if (!url) return;

    URL.revokeObjectURL(url);

}

export function formatDuration(seconds = 0) {

    const mins = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}