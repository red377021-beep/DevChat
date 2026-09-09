import "./VoiceBubble.css";

function VoiceProgress({

    current = 0,

    duration = 0,

    onSeek

}) {

    function handleChange(event) {

        const value = Number(event.target.value);

        onSeek?.(value);

    }

    return (

        <input

            className="voice-progress"

            type="range"

            min="0"

            max={duration || 0}

            step="0.01"

            value={current}

            onChange={handleChange}

        />

        );

}

export default VoiceProgress;