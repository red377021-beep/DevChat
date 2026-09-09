import { useCallback, useEffect, useRef, useState } from "react";


// =====================================================
// WEBRTC CONFIG
// =====================================================

const RTC_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
        {
            urls: "stun:stun1.l.google.com:19302",
        },
    ],
};


// =====================================================
// HELPER
// =====================================================

function normalizeUserId(value) {
    if (value === null || value === undefined) {
        return null;
    }

    return String(value);
}


// =====================================================
// HOOK
// =====================================================

export default function useWebRTC({
    socket,
    currentUserId,
    targetUserId,
    callType,
}) {

    // =================================================
    // REFS
    // =================================================

    const peerRef = useRef(null);

    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);

    const pendingCandidatesRef = useRef([]);

    const activeTargetUserIdRef = useRef(null);
    const activeCallTypeRef = useRef(null);

    const mountedRef = useRef(true);


    // =================================================
    // STATE
    // =================================================

    const [localStream, setLocalStream] = useState(null);

    const [remoteStream, setRemoteStream] = useState(null);

    const [connectionState, setConnectionState] = useState("idle");


    // =================================================
    // SYNC TARGET USER
    // =================================================

    useEffect(() => {

        activeTargetUserIdRef.current =
            normalizeUserId(targetUserId);

    }, [targetUserId]);


    // =================================================
    // SYNC CALL TYPE
    // =================================================

    useEffect(() => {

        activeCallTypeRef.current =
            callType || null;

    }, [callType]);


    // =====================================================
    // CREATE PEER CONNECTION
    // =====================================================

    const createPeerConnection = useCallback(() => {

        if (peerRef.current) {
            return peerRef.current;
        }


        const peer = new RTCPeerConnection(RTC_CONFIG);


        // =================================================
        // ICE CANDIDATE
        // =================================================

        peer.onicecandidate = (event) => {

            if (!event.candidate) {
                return;
            }


            const target =
                activeTargetUserIdRef.current;


            if (!target) {

                console.warn(
                    "⚠️ ICE candidate ignored — no target"
                );

                return;
            }


            console.log(
                "🧊 Sending ICE candidate to:",
                target
            );


            socket?.emit(
                "call:ice-candidate",
                {
                    to: String(target),
                    candidate: event.candidate,
                }
            );

        };


        // =================================================
        // REMOTE TRACK
        // =================================================

        peer.ontrack = (event) => {

            console.log(
                "🎥 REMOTE TRACK:",
                event.track.kind
            );


            let stream =
                event.streams?.[0];


            // -------------------------------------------------
            // Some browsers may not provide event.streams
            // -------------------------------------------------

            if (!stream) {

                if (!remoteStreamRef.current) {

                    remoteStreamRef.current =
                        new MediaStream();

                }


                stream =
                    remoteStreamRef.current;


                const alreadyAdded =
                    stream
                        .getTracks()
                        .some(
                            (track) =>
                                track.id === event.track.id
                        );


                if (!alreadyAdded) {

                    stream.addTrack(
                        event.track
                    );

                }

            }


            remoteStreamRef.current =
                stream;


            if (mountedRef.current) {

                setRemoteStream(
                    stream
                );

            }


            console.log(
                "✅ Remote stream updated"
            );

        };


        // =================================================
        // CONNECTION STATE
        // =================================================

        peer.onconnectionstatechange = () => {

            console.log(
                "🔌 Connection state:",
                peer.connectionState
            );


            if (!mountedRef.current) {
                return;
            }


            switch (peer.connectionState) {

                case "new":
                    setConnectionState("new");
                    break;

                case "connecting":
                    setConnectionState("connecting");
                    break;

                case "connected":
                    setConnectionState("connected");
                    break;

                case "disconnected":
                    setConnectionState("disconnected");
                    break;

                case "failed":
                    setConnectionState("failed");
                    break;

                case "closed":
                    setConnectionState("closed");
                    break;

                default:
                    break;

            }

        };


        // =================================================
        // ICE CONNECTION STATE
        // =================================================

        peer.oniceconnectionstatechange = () => {

            console.log(
                "🧊 ICE connection state:",
                peer.iceConnectionState
            );

        };


        // =================================================
        // SIGNALING STATE
        // =================================================

        peer.onsignalingstatechange = () => {

            console.log(
                "📡 Signaling state:",
                peer.signalingState
            );

        };


        // =================================================
        // ICE GATHERING STATE
        // =================================================

        peer.onicegatheringstatechange = () => {

            console.log(
                "🧊 ICE gathering:",
                peer.iceGatheringState
            );

        };


        peerRef.current = peer;


        return peer;

    }, [socket]);


    // =====================================================
    // GET LOCAL MEDIA
    // =====================================================

    const getLocalMedia = useCallback(
        async (requestedCallType) => {

            const finalCallType =
                requestedCallType === "video"
                    ? "video"
                    : "audio";


            const needsVideo =
                finalCallType === "video";


            console.log(
                "🎙️ MEDIA REQUEST:",
                {
                    audio: true,
                    video: needsVideo,
                }
            );


            // =================================================
            // REUSE EXISTING STREAM WHEN POSSIBLE
            // =================================================

            const existingStream =
                localStreamRef.current;


            if (existingStream) {

                const audioTracks =
                    existingStream.getAudioTracks();


                const videoTracks =
                    existingStream.getVideoTracks();


                const hasAudio =
                    audioTracks.length > 0;


                const hasVideo =
                    videoTracks.length > 0;


                // ---------------------------------------------
                // AUDIO CALL
                // ---------------------------------------------

                if (!needsVideo && hasAudio) {

                    // Do not send video during an audio call.

                    videoTracks.forEach(
                        (track) => {
                            track.stop();
                            existingStream.removeTrack(track);
                        }
                    );


                    if (mountedRef.current) {

                        setLocalStream(
                            existingStream
                        );

                    }


                    return existingStream;

                }


                // ---------------------------------------------
                // VIDEO CALL
                // ---------------------------------------------

                if (
                    needsVideo &&
                    hasAudio &&
                    hasVideo
                ) {

                    if (mountedRef.current) {

                        setLocalStream(
                            existingStream
                        );

                    }


                    return existingStream;

                }

            }


            // =================================================
            // STOP OLD STREAM
            // =================================================

            if (existingStream) {

                existingStream
                    .getTracks()
                    .forEach(
                        (track) => track.stop()
                    );

            }


            localStreamRef.current = null;


            if (mountedRef.current) {

                setLocalStream(null);

            }


            // =================================================
            // AUDIO CALL
            // =================================================

            if (!needsVideo) {

                try {

                    const stream =
                        await navigator.mediaDevices
                            .getUserMedia({
                                audio: true,
                                video: false,
                            });


                    localStreamRef.current =
                        stream;


                    if (mountedRef.current) {

                        setLocalStream(
                            stream
                        );

                    }


                    console.log(
                        "✅ AUDIO MEDIA READY"
                    );


                    return stream;

                } catch (error) {

                    console.error(
                        "❌ AUDIO getUserMedia FAILED:",
                        error
                    );


                    if (mountedRef.current) {

                        setConnectionState(
                            "failed"
                        );

                    }


                    throw error;

                }

            }


            // =================================================
            // VIDEO CALL
            //
            // First try:
            // microphone + camera
            // =================================================

            try {

                const stream =
                    await navigator.mediaDevices
                        .getUserMedia({
                            audio: true,
                            video: true,
                        });


                localStreamRef.current =
                    stream;


                if (mountedRef.current) {

                    setLocalStream(
                        stream
                    );

                }


                console.log(
                    "✅ CAMERA + MICROPHONE READY"
                );


                return stream;

            } catch (videoError) {

                console.warn(
                    "⚠️ CAMERA NOT AVAILABLE:",
                    videoError
                );


                // =================================================
                // ONLY FALLBACK WHEN CAMERA IS THE PROBLEM
                // =================================================

                const cameraMissing =
                    videoError?.name === "NotFoundError" ||
                    videoError?.name === "DevicesNotFoundError" ||
                    videoError?.name === "OverconstrainedError";


                if (!cameraMissing) {

                    console.error(
                        "❌ VIDEO MEDIA FAILED:",
                        videoError
                    );


                    if (mountedRef.current) {

                        setConnectionState(
                            "failed"
                        );

                    }


                    throw videoError;

                }


                // =================================================
                // CAMERA DOES NOT EXIST
                //
                // CONTINUE WITH MICROPHONE ONLY
                // =================================================

                console.warn(
                    "📷 No camera detected."
                );

                console.warn(
                    "🎙️ Continuing video call as AUDIO + VIDEO-RECEIVE"
                );


                try {

                    const audioOnlyStream =
                        await navigator.mediaDevices
                            .getUserMedia({
                                audio: true,
                                video: false,
                            });


                    localStreamRef.current =
                        audioOnlyStream;


                    if (mountedRef.current) {

                        setLocalStream(
                            audioOnlyStream
                        );

                    }


                    console.log(
                        "✅ AUDIO-ONLY FALLBACK READY"
                    );


                    return audioOnlyStream;

                } catch (audioError) {

                    console.error(
                        "❌ AUDIO FALLBACK FAILED:",
                        audioError
                    );


                    if (mountedRef.current) {

                        setConnectionState(
                            "failed"
                        );

                    }


                    throw audioError;

                }

            }

        },
        []
    );


    // =====================================================
    // ADD LOCAL TRACKS
    // =====================================================

    const addLocalTracks = useCallback(
        (peer, stream) => {

            if (!peer || !stream) {
                return;
            }


            const senders =
                peer.getSenders();


            stream
                .getTracks()
                .forEach((track) => {

                    const alreadyAdded =
                        senders.some(
                            (sender) =>
                                sender.track?.id ===
                                track.id
                        );


                    if (alreadyAdded) {
                        return;
                    }


                    console.log(
                        "➕ Adding local track:",
                        track.kind
                    );


                    peer.addTrack(
                        track,
                        stream
                    );

                });

        },
        []
    );


    // =====================================================
    // ENSURE VIDEO RECEIVE TRANSCEIVER
    // =====================================================

    const ensureVideoReceiveTransceiver =
        useCallback(
            (peer) => {

                if (!peer) {
                    return;
                }


                const transceivers =
                    peer.getTransceivers();


                const videoTransceiver =
                    transceivers.find(
                        (transceiver) =>
                            transceiver.receiver
                                ?.track
                                ?.kind === "video"
                    );


                if (videoTransceiver) {
                    return;
                }


                console.log(
                    "🎥 Creating video recvonly transceiver"
                );


                try {

                    peer.addTransceiver(
                        "video",
                        {
                            direction: "recvonly",
                        }
                    );

                } catch (error) {

                    console.warn(
                        "⚠️ Could not create video transceiver:",
                        error
                    );

                }

            },
            []
        );


    // =====================================================
    // FLUSH ICE CANDIDATES
    // =====================================================

    const flushPendingCandidates =
        useCallback(
            async () => {

                const peer =
                    peerRef.current;


                if (
                    !peer ||
                    !peer.remoteDescription
                ) {

                    return;

                }


                const candidates =
                    pendingCandidatesRef.current;


                pendingCandidatesRef.current =
                    [];


                for (
                    const candidate
                    of candidates
                ) {

                    try {

                        await peer.addIceCandidate(
                            candidate
                        );


                        console.log(
                            "🧊 Queued ICE candidate added"
                        );

                    } catch (error) {

                        console.warn(
                            "⚠️ Failed queued ICE:",
                            error
                        );

                    }

                }

            },
            []
        );


    // =====================================================
    // START CALL
    // =====================================================

    const startCall = useCallback(
        async (
            targetOverride,
            requestedCallType
        ) => {

            const target =
                normalizeUserId(
                    targetOverride ||
                    activeTargetUserIdRef.current
                );


            const finalCallType =
                requestedCallType === "video"
                    ? "video"
                    : "audio";


            const currentUser =
                normalizeUserId(
                    currentUserId
                );


            if (!socket) {

                console.error(
                    "❌ Cannot start call — socket missing"
                );

                return false;

            }


            if (!currentUser) {

                console.error(
                    "❌ Cannot start call — current user missing"
                );

                return false;

            }


            if (!target) {

                console.error(
                    "❌ Cannot start call — target missing"
                );

                return false;

            }


            if (target === currentUser) {

                console.warn(
                    "⚠️ Cannot call yourself"
                );

                return false;

            }


            // =================================================
            // SET REFS BEFORE MEDIA / SIGNALING
            // =================================================

            activeTargetUserIdRef.current =
                target;


            activeCallTypeRef.current =
                finalCallType;


            console.log(
                "📞 Starting WebRTC call:",
                {
                    userId: target,
                    type: finalCallType,
                }
            );


            if (mountedRef.current) {

                setConnectionState(
                    "connecting"
                );

            }


            try {

                // ---------------------------------------------
                // GET MICROPHONE
                // + CAMERA IF AVAILABLE
                // ---------------------------------------------

                const stream =
                    await getLocalMedia(
                        finalCallType
                    );


                if (!stream) {

                    throw new Error(
                        "Local media stream unavailable"
                    );

                }


                // ---------------------------------------------
                // CREATE PEER
                // ---------------------------------------------

                const peer =
                    createPeerConnection();


                // ---------------------------------------------
                // ADD AUDIO / VIDEO TRACKS
                // ---------------------------------------------

                addLocalTracks(
                    peer,
                    stream
                );


                // ---------------------------------------------
                // IF THIS IS A VIDEO CALL BUT WE HAVE
                // NO CAMERA, WE STILL WANT TO RECEIVE
                // REMOTE VIDEO.
                // ---------------------------------------------

                const hasLocalVideo =
                    stream
                        .getVideoTracks()
                        .length > 0;


                if (
                    finalCallType === "video" &&
                    !hasLocalVideo
                ) {

                    ensureVideoReceiveTransceiver(
                        peer
                    );

                }


                // ---------------------------------------------
                // CREATE OFFER
                // ---------------------------------------------

                const offer =
                    await peer.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo:
                            finalCallType === "video",
                    });


                await peer.setLocalDescription(
                    offer
                );


                // ---------------------------------------------
                // SEND OFFER
                // ---------------------------------------------

                console.log(
                    "📤 Sending CALL OFFER:",
                    {
                        to: target,
                        type: finalCallType,
                        hasLocalVideo,
                    }
                );


                socket.emit(
                    "call:offer",
                    {
                        to: target,
                        offer,
                        callType: finalCallType,
                        caller: {
                            userId: currentUser,
                        },
                    }
                );


                return true;

            } catch (error) {

                console.error(
                    "❌ START CALL ERROR:",
                    error
                );


                if (mountedRef.current) {

                    setConnectionState(
                        "failed"
                    );

                }


                return false;

            }

        },
        [
            socket,
            currentUserId,
            getLocalMedia,
            createPeerConnection,
            addLocalTracks,
            ensureVideoReceiveTransceiver,
        ]
    );


    // =====================================================
    // ACCEPT CALL
    // =====================================================

    const acceptCall = useCallback(
        async (
            offer,
            callerUserId,
            requestedCallType
        ) => {

            const callerId =
                normalizeUserId(
                    callerUserId
                );


            const finalCallType =
                requestedCallType === "video"
                    ? "video"
                    : "audio";


            const currentUser =
                normalizeUserId(
                    currentUserId
                );


            if (!socket) {

                console.error(
                    "❌ Cannot accept call — socket missing"
                );

                return false;

            }


            if (!callerId) {

                console.error(
                    "❌ Cannot accept call — caller missing"
                );

                return false;

            }


            if (!offer) {

                console.error(
                    "❌ Cannot accept call — offer missing"
                );

                return false;

            }


            if (
                currentUser &&
                callerId === currentUser
            ) {

                console.warn(
                    "⚠️ Ignoring own call"
                );

                return false;

            }


            // =================================================
            // SET REFS FIRST
            // =================================================

            activeTargetUserIdRef.current =
                callerId;


            activeCallTypeRef.current =
                finalCallType;


            console.log(
                "📲 Accepting WebRTC call:",
                {
                    callerId,
                    type: finalCallType,
                }
            );


            if (mountedRef.current) {

                setConnectionState(
                    "connecting"
                );

            }


            try {

                // ---------------------------------------------
                // GET LOCAL MEDIA
                // CAMERA IS OPTIONAL
                // ---------------------------------------------

                const stream =
                    await getLocalMedia(
                        finalCallType
                    );


                if (!stream) {

                    throw new Error(
                        "Local media stream unavailable"
                    );

                }


                // ---------------------------------------------
                // CREATE PEER
                // ---------------------------------------------

                const peer =
                    createPeerConnection();


                // ---------------------------------------------
                // ADD LOCAL TRACKS
                // ---------------------------------------------

                addLocalTracks(
                    peer,
                    stream
                );


                // ---------------------------------------------
                // CHECK LOCAL CAMERA
                // ---------------------------------------------

                const hasLocalVideo =
                    stream
                        .getVideoTracks()
                        .length > 0;


                // ---------------------------------------------
                // IF WE DON'T HAVE CAMERA,
                // STILL RECEIVE CALLER VIDEO
                // ---------------------------------------------

                if (
                    finalCallType === "video" &&
                    !hasLocalVideo
                ) {

                    ensureVideoReceiveTransceiver(
                        peer
                    );

                }


                // ---------------------------------------------
                // SET REMOTE OFFER
                // ---------------------------------------------

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        offer
                    )
                );


                // ---------------------------------------------
                // FLUSH ICE
                // ---------------------------------------------

                await flushPendingCandidates();


                // ---------------------------------------------
                // CREATE ANSWER
                // ---------------------------------------------

                const answer =
                    await peer.createAnswer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo:
                            finalCallType === "video",
                    });


                await peer.setLocalDescription(
                    answer
                );


                // ---------------------------------------------
                // SEND ANSWER
                // ---------------------------------------------

                console.log(
                    "📤 Sending CALL ANSWER:",
                    {
                        to: callerId,
                        type: finalCallType,
                        hasLocalVideo,
                    }
                );


                socket.emit(
                    "call:answer",
                    {
                        to: callerId,
                        answer,
                    }
                );


                return true;

            } catch (error) {

                console.error(
                    "❌ ACCEPT CALL ERROR:",
                    error
                );


                if (mountedRef.current) {

                    setConnectionState(
                        "failed"
                    );

                }


                return false;

            }

        },
        [
            socket,
            currentUserId,
            getLocalMedia,
            createPeerConnection,
            addLocalTracks,
            ensureVideoReceiveTransceiver,
            flushPendingCandidates,
        ]
    );


    // =====================================================
    // PROCESS ANSWER
    // =====================================================

    const processAnswer = useCallback(
        async (
            answer,
            fromUserId
        ) => {

            const sender =
                normalizeUserId(
                    fromUserId
                );


            const activeTarget =
                activeTargetUserIdRef.current;


            if (
                sender &&
                activeTarget &&
                sender !== activeTarget
            ) {

                console.warn(
                    "⚠️ Ignoring answer from unexpected user:",
                    sender
                );

                return;

            }


            const peer =
                peerRef.current;


            if (!peer) {

                console.warn(
                    "⚠️ Answer received but peer missing"
                );

                return;

            }


            try {

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        answer
                    )
                );


                await flushPendingCandidates();


                console.log(
                    "✅ Remote answer applied"
                );

            } catch (error) {

                console.error(
                    "❌ Failed to process answer:",
                    error
                );

            }

        },
        [
            flushPendingCandidates,
        ]
    );


    // =====================================================
    // PROCESS ICE CANDIDATE
    // =====================================================

    const processIceCandidate =
        useCallback(
            async (
                candidate,
                fromUserId
            ) => {

                if (!candidate) {
                    return;
                }


                const sender =
                    normalizeUserId(
                        fromUserId
                    );


                const activeTarget =
                    activeTargetUserIdRef.current;


                if (
                    sender &&
                    activeTarget &&
                    sender !== activeTarget
                ) {

                    console.warn(
                        "⚠️ Ignoring ICE from unexpected user:",
                        sender
                    );

                    return;

                }


                const peer =
                    peerRef.current;


                // =================================================
                // PEER NOT READY
                // =================================================

                if (!peer) {

                    pendingCandidatesRef.current.push(
                        candidate
                    );


                    console.log(
                        "🧊 ICE queued — peer not ready"
                    );


                    return;

                }


                // =================================================
                // REMOTE DESCRIPTION NOT READY
                // =================================================

                if (!peer.remoteDescription) {

                    pendingCandidatesRef.current.push(
                        candidate
                    );


                    console.log(
                        "🧊 ICE queued — remote description missing"
                    );


                    return;

                }


                try {

                    await peer.addIceCandidate(
                        candidate
                    );


                    console.log(
                        "🧊 ICE candidate added"
                    );

                } catch (error) {

                    console.warn(
                        "⚠️ Failed to add ICE candidate:",
                        error
                    );

                }

            },
            []
        );


    // =====================================================
    // TOGGLE MICROPHONE
    // =====================================================

    const toggleMicrophone =
        useCallback(
            () => {

                const stream =
                    localStreamRef.current;


                if (!stream) {
                    return false;
                }


                const audioTracks =
                    stream.getAudioTracks();


                if (!audioTracks.length) {
                    return false;
                }


                const nextEnabled =
                    !audioTracks[0].enabled;


                audioTracks.forEach(
                    (track) => {
                        track.enabled =
                            nextEnabled;
                    }
                );


                console.log(
                    "🎙️ Microphone:",
                    nextEnabled
                        ? "ON"
                        : "OFF"
                );


                return nextEnabled;

            },
            []
        );


    // =====================================================
    // TOGGLE CAMERA
    // =====================================================

    const toggleCamera =
        useCallback(
            () => {

                const stream =
                    localStreamRef.current;


                if (!stream) {

                    console.warn(
                        "📷 Camera toggle ignored — no local stream"
                    );

                    return false;

                }


                const videoTracks =
                    stream.getVideoTracks();


                // =================================================
                // NO CAMERA
                // =================================================

                if (!videoTracks.length) {

                    console.warn(
                        "📷 Camera unavailable on this device"
                    );

                    return false;

                }


                const nextEnabled =
                    !videoTracks[0].enabled;


                videoTracks.forEach(
                    (track) => {

                        track.enabled =
                            nextEnabled;

                    }
                );


                console.log(
                    "📷 Camera:",
                    nextEnabled
                        ? "ON"
                        : "OFF"
                );


                return nextEnabled;

            },
            []
        );


    // =====================================================
    // CLEANUP
    // =====================================================

    const cleanup =
        useCallback(
            () => {

                console.log(
                    "🧹 WEBRTC CLEANUP"
                );


                // ---------------------------------------------
                // STOP LOCAL TRACKS
                // ---------------------------------------------

                if (
                    localStreamRef.current
                ) {

                    localStreamRef.current
                        .getTracks()
                        .forEach(
                            (track) => {

                                try {

                                    track.stop();

                                } catch (error) {

                                    console.warn(
                                        "⚠️ Local track cleanup error:",
                                        error
                                    );

                                }

                            }
                        );

                }


                // ---------------------------------------------
                // STOP REMOTE TRACKS
                // ---------------------------------------------

                if (
                    remoteStreamRef.current
                ) {

                    remoteStreamRef.current
                        .getTracks()
                        .forEach(
                            (track) => {

                                try {

                                    track.stop();

                                } catch (error) {

                                    console.warn(
                                        "⚠️ Remote track cleanup error:",
                                        error
                                    );

                                }

                            }
                        );

                }


                // ---------------------------------------------
                // CLOSE PEER
                // ---------------------------------------------

                if (peerRef.current) {

                    try {

                        peerRef.current.close();

                    } catch (error) {

                        console.warn(
                            "⚠️ Peer cleanup error:",
                            error
                        );

                    }

                }


                peerRef.current =
                    null;


                localStreamRef.current =
                    null;


                remoteStreamRef.current =
                    null;


                pendingCandidatesRef.current =
                    [];


                activeTargetUserIdRef.current =
                    null;


                activeCallTypeRef.current =
                    null;


                if (mountedRef.current) {

                    setLocalStream(null);

                    setRemoteStream(null);

                    setConnectionState(
                        "idle"
                    );

                }


                console.log(
                    "✅ WEBRTC CLEANUP COMPLETE"
                );

            },
            []
        );


    // =====================================================
    // SOCKET LISTENERS
    //
    // These stay active independently from UI state.
    // =====================================================

    useEffect(() => {

        mountedRef.current = true;


        if (!socket) {
            return undefined;
        }


        // =================================================
        // CALL ANSWER
        // =================================================

        const handleAnswer = ({
            answer,
            fromUserId,
        }) => {

            console.log(
                "📥 CALL ANSWER RECEIVED:",
                fromUserId
            );


            processAnswer(
                answer,
                fromUserId
            );

        };


        // =================================================
        // ICE CANDIDATE
        // =================================================

        const handleIceCandidate = ({
            candidate,
            fromUserId,
        }) => {

            console.log(
                "📥 ICE CANDIDATE RECEIVED:",
                fromUserId
            );


            processIceCandidate(
                candidate,
                fromUserId
            );

        };


        socket.on(
            "call:answer",
            handleAnswer
        );


        socket.on(
            "call:ice-candidate",
            handleIceCandidate
        );


        return () => {

            socket.off(
                "call:answer",
                handleAnswer
            );


            socket.off(
                "call:ice-candidate",
                handleIceCandidate
            );

        };

    }, [
        socket,
        processAnswer,
        processIceCandidate,
    ]);


    // =====================================================
    // COMPONENT UNMOUNT
    // =====================================================

    useEffect(() => {

        return () => {

            mountedRef.current =
                false;


            // Do not call state setters
            // after unmount.

            if (
                localStreamRef.current
            ) {

                localStreamRef.current
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

            }


            if (
                remoteStreamRef.current
            ) {

                remoteStreamRef.current
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

            }


            if (peerRef.current) {

                try {

                    peerRef.current.close();

                } catch {
                    // ignore cleanup errors
                }

            }


            peerRef.current =
                null;

            localStreamRef.current =
                null;

            remoteStreamRef.current =
                null;

            pendingCandidatesRef.current =
                [];

        };

    }, []);


    // =====================================================
    // RETURN
    // =====================================================

    return {

        // -----------------------------------------------
        // PEER
        // -----------------------------------------------

        peer:
            peerRef.current,


        // -----------------------------------------------
        // STREAMS
        // -----------------------------------------------

        localStream,

        remoteStream,


        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        connectionState,


        // -----------------------------------------------
        // CALL
        // -----------------------------------------------

        startCall,

        acceptCall,


        // -----------------------------------------------
        // SIGNALING
        // -----------------------------------------------

        processAnswer,

        processIceCandidate,


        // -----------------------------------------------
        // CONTROLS
        // -----------------------------------------------

        toggleMicrophone,

        toggleCamera,


        // -----------------------------------------------
        // CLEANUP
        // -----------------------------------------------

        cleanup,

    };

}