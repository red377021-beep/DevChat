import "./VoiceBubble.css";

import {

    useEffect,
    useMemo,
    useState

} from "react";

function VoiceWave({

    progress = 0,

    playing = false

}) {

    // ==========================================
    // Wave Bars
    // ==========================================

    const bars = useMemo(() => {

        return [

            18,26,14,34,24,16,30,20,28,14,

            36,22,18,30,12,26,32,18,28,20,

            24,34,18,30,16,22,28,36,18,24,

            30,20,14,26,32,18

        ];

    }, []);

    const [activeBars,setActiveBars]=useState(0);
        // ==========================================
    // Active Bars
    // ==========================================

    useEffect(() => {

        const count = Math.floor(

            (progress / 100) * bars.length

        );

        setActiveBars(count);

    }, [

        progress,

        bars

    ]);

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="voice-wave">

            {

                bars.map((height,index)=>(

                    <span

                        key={index}

                        className={`

                            voice-bar

                            ${index < activeBars ? "active" : ""}

                            ${playing ? "playing" : ""}

                        `}

                        style={{

                            height:`${height}px`,

                            animationDelay:`${index * 25}ms`

                        }}

                    />

                ))

            }

        </div>

    );
    }

export default VoiceWave;