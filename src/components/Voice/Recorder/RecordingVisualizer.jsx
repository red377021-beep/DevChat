import "./VoiceRecorder.css";

function RecordingVisualizer() {

    return (

        <div className="recording-visualizer">

            {[...Array(20)].map((_, index) => (

                <span

                    key={index}

                    className="record-bar"

                    style={{

                        animationDelay: `${index * 0.08}s`

                    }}

                />

            ))}

        </div>

    );

}

export default RecordingVisualizer;