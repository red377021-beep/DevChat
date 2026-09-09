// ==========================================================
// Format Recording Time
// 0 -> 00:00
// 65 -> 01:05
// ==========================================================

export function formatRecordingTime(seconds = 0) {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}

// ==========================================================
// Format File Size
// ==========================================================

export function formatFileSize(bytes = 0) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(1)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

}

// ==========================================================
// Generate Voice File Name
// ==========================================================

export function generateVoiceFileName() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const hour = String(now.getHours()).padStart(2, "0");

    const minute = String(now.getMinutes()).padStart(2, "0");

    const second = String(now.getSeconds()).padStart(2, "0");

    return `voice_${year}${month}${day}_${hour}${minute}${second}.webm`;

}

// ==========================================================
// Get Audio Duration
// ==========================================================

export function getAudioDuration(file) {

    return new Promise((resolve, reject) => {

        const audio = document.createElement("audio");

        audio.preload = "metadata";

        audio.src = URL.createObjectURL(file);

        audio.onloadedmetadata = () => {

            URL.revokeObjectURL(audio.src);

            resolve(audio.duration);

        };

        audio.onerror = () => {

            reject("Unable to read audio duration.");

        };

    });

}

// ==========================================================
// Create Object URL
// ==========================================================

export function createAudioURL(blob) {

    return URL.createObjectURL(blob);

}

// ==========================================================
// Remove Object URL
// ==========================================================

export function destroyAudioURL(url) {

    if (!url) return;

    URL.revokeObjectURL(url);

}

// ==========================================================
// Waveform Placeholder
// Future Waveform Generator
// ==========================================================

export async function generateWaveform() {

    return [];

}