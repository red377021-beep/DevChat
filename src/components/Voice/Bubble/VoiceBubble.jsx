import "./VoiceBubble.css";

import {

    Play,
    Pause,
    Volume2,
    Heart,
    Download,
    Forward,
    Star

} from "lucide-react";

import {

    useEffect,
    useRef,
    useState,
    useCallback

} from "react";

function VoiceBubble({

    audio,

    blob,

    duration = 0,

    own,

    time,

    seen,

    reactions = [],

    theme = "purple"

}){

    // ===========================================
    // Refs
    // ===========================================

    const playerRef = useRef(null);

    const animationRef = useRef(null);

    const seekRef = useRef(null);

    // ===========================================
    // Player
    // ===========================================

    const [playing,setPlaying]=useState(false);

    const [progress,setProgress]=useState(0);

    const [currentTime,setCurrentTime]=useState(0);

    const [speed,setSpeed]=useState(1);

    const [volume,setVolume]=useState(1);

    // ===========================================
    // Future Features
    // ===========================================

    const [liked,setLiked]=useState(false);

    const [bookmarked,setBookmarked]=useState(false);

    const [downloading,setDownloading]=useState(false);

    const [waveColor,setWaveColor]=useState(theme);

    // ===========================================
    // Play
    // ===========================================

    const playAudio=useCallback(()=>{

        if(!playerRef.current) return;

        playerRef.current.play();

        setPlaying(true);

    },[]);

    // ===========================================
    // Pause
    // ===========================================

    const pauseAudio=useCallback(()=>{

        if(!playerRef.current) return;

        playerRef.current.pause();

        setPlaying(false);

    },[]);

    // ===========================================
    // Toggle
    // ===========================================

    function togglePlay(){

        playing

        ? pauseAudio()

        : playAudio();

    }

    // ===========================================
    // Speed
    // ===========================================

    function toggleSpeed(){

        const speeds=[0.5,1,1.5,2];

        const index=speeds.indexOf(speed);

        const next=

        speeds[(index+1)%speeds.length];

        setSpeed(next);

        if(playerRef.current){

            playerRef.current.playbackRate=next;

        }

    }

    // ===========================================
    // Volume
    // ===========================================

    function changeVolume(value){

        setVolume(value);

        if(playerRef.current){

            playerRef.current.volume=value;

        }

    }
        // ===========================================
    // Progress Engine
    // ===========================================

    useEffect(() => {

        const player = playerRef.current;

        if (!player) return;

        function updateProgress() {

            if (player.duration) {

                const percent =

                    (player.currentTime / player.duration) * 100;

                setProgress(percent);

                setCurrentTime(player.currentTime);

            }

            animationRef.current =

                requestAnimationFrame(updateProgress);

        }

        if (playing) {

            animationRef.current =

                requestAnimationFrame(updateProgress);

        }

        function handleEnded() {

            setPlaying(false);

            setProgress(100);

            setCurrentTime(player.duration);

        }

        player.addEventListener("ended", handleEnded);

        return () => {

            cancelAnimationFrame(animationRef.current);

            player.removeEventListener(

                "ended",

                handleEnded

            );

        };

    }, [playing]);

    // ===========================================
    // Seek Engine
    // ===========================================

    function seekAudio(event) {

        if (!playerRef.current) return;

        const rect =

            seekRef.current.getBoundingClientRect();

        const x = event.clientX - rect.left;

        const percent = x / rect.width;

        playerRef.current.currentTime =

            percent * playerRef.current.duration;

        setProgress(percent * 100);

    }

    // ===========================================
    // Download
    // ===========================================

    function downloadAudio() {

        if (!audio) return;

        setDownloading(true);

        const link = document.createElement("a");

        link.href = audio;

        link.download =

            `voice-${Date.now()}.webm`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(() => {

            setDownloading(false);

        }, 600);

    }

    // ===========================================
    // Bookmark
    // ===========================================

    function toggleBookmark() {

        setBookmarked(prev => !prev);

    }

    // ===========================================
    // Like
    // ===========================================

    function toggleLike() {

        setLiked(prev => !prev);

    }

    // ===========================================
    // Format Time
    // ===========================================

    function format(sec) {

        const minutes =

            Math.floor(sec / 60);

        const seconds =

            Math.floor(sec % 60);

        return `${minutes}:${seconds

            .toString()

            .padStart(2, "0")}`;

    }
        // ===========================================
    // UI
    // ===========================================

    return (

        <div className={`voice-container ${own ? "own" : ""}`}>

            <audio
                ref={playerRef}
                src={audio}
            />

            {/* PLAY */}

            <button

                className={`voice-play ${playing ? "playing" : ""}`}

                onClick={togglePlay}

            >

                {

                    playing

                        ? <Pause size={16}/>

                        : <Play size={16}/>

                }

            </button>

            {/* WAVE */}

            <div

                ref={seekRef}

                className="voice-wave-wrapper"

                onClick={seekAudio}

            >

                <div

                    className="voice-progress"

                    style={{

                        width:`${progress}%`

                    }}

                />

                <div className="voice-wave">

                    {

                        [...Array(48)].map((_,i)=>(

                            <span

                                key={i}

                                className={

                                    playing

                                    ? "wave-bar playing"

                                    : "wave-bar"

                                }

                                style={{

                                    height:`${8+((i*11)%24)}px`,

                                    animationDelay:`${i*0.04}s`

                                }}

                            />

                        ))

                    }

                </div>

            </div>

            {/* RIGHT */}

            <div className="voice-right">

                <button

                    className="voice-speed"

                    onClick={toggleSpeed}

                >

                    {speed}x

                </button>

                <span className="voice-current">

                    {format(currentTime)}

                </span>

                <span className="voice-total">

                    {format(duration)}

                </span>

                <button

                    className={liked ? "voice-icon active" : "voice-icon"}

                    onClick={toggleLike}

                >

                    <Heart size={14}/>

                </button>

                <button

                    className={bookmarked ? "voice-icon active" : "voice-icon"}

                    onClick={toggleBookmark}

                >

                    <Star size={14}/>

                </button>

                <button

                    className="voice-icon"

                    onClick={downloadAudio}

                >

                    <Download size={14}/>

                </button>

                <button

                    className="voice-icon"

                >

                    <Forward size={14}/>

                </button>

                {

                    own && (

                        <span className="voice-status">

                            {

                                seen

                                    ? "👀"

                                    : "🫧"

                            }

                        </span>

                    )

                }

            </div>

        </div>

    );

}

export default VoiceBubble;