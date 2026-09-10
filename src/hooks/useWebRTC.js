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


        const peer = new RTCPeerConnection(
            RTC_CONFIG
        );


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


        peerRef.current =
            peer;


        return peer;

    }, [socket]);


    // =====================================================
    // GET LOCAL MEDIA
    //
    // IMPORTANT:
    // Media failure NEVER kills the call.
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
            // REUSE EXISTING STREAM
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


                // -------------------------------------------------
                // AUDIO CALL
                // -------------------------------------------------

                if (!needsVideo && hasAudio) {

                    videoTracks.forEach(
                        (track) => {

                            track.stop();

                            existingStream.removeTrack(
                                track
                            );

                        }
                    );


                    if (mountedRef.current) {

                        setLocalStream(
                            existingStream
                        );

                    }


                    return existingStream;

                }


                // -------------------------------------------------
                // VIDEO CALL
                // -------------------------------------------------

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
                        (track) => {

                            try {
                                track.stop();
                            } catch {
                                // ignore
                            }

                        }
                    );

            }


            localStreamRef.current =
                null;


            if (mountedRef.current) {

                setLocalStream(null);

            }


            // =================================================
            // TRY TO GET MEDIA
            // =================================================

            try {

                const stream =
                    await navigator.mediaDevices
                        .getUserMedia({
                            audio: true,
                            video: needsVideo,
                        });


                localStreamRef.current =
                    stream;


                if (mountedRef.current) {

                    setLocalStream(
                        stream
                    );

                }


                console.log(
                    needsVideo
                        ? "✅ CAMERA + MICROPHONE READY"
                        : "✅ MICROPHONE READY"
                );


                return stream;

            } catch (error) {

                console.warn(
                    "⚠️ LOCAL MEDIA UNAVAILABLE:",
                    error?.name,
                    error?.message
                );


                // =================================================
                // IMPORTANT
                //
                // DO NOT FAIL THE CALL.
                //
                // Return an empty MediaStream so WebRTC can
                // continue using recvonly transceivers.
                // =================================================

                const emptyStream =
                    new MediaStream();


                localStreamRef.current =
                    emptyStream;


                if (mountedRef.current) {

                    setLocalStream(
                        emptyStream
                    );

                }


                console.warn(
                    "📞 Continuing call without local microphone/camera"
                );


                return emptyStream;

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
    // ENSURE RECEIVE TRANSCEIVERS
    //
    // If local device has no mic/camera, we still create
    // receive-only channels.
    // =====================================================

    const ensureReceiveTransceivers = useCallback(
        (peer, requestedCallType, stream) => {

            if (!peer) {
                return;
            }


            const finalCallType =
                requestedCallType === "video"
                    ? "video"
                    : "audio";


            const hasAudio =
                Boolean(
                    stream?.getAudioTracks?.()
                        .length
                );


            const hasVideo =
                Boolean(
                    stream?.getVideoTracks?.()
                        .length
                );


            const transceivers =
                peer.getTransceivers();


            // =================================================
            // AUDIO
            // =================================================

            const audioTransceiver =
                transceivers.find(
                    (transceiver) =>
                        transceiver.receiver
                            ?.track
                            ?.kind === "audio"
                );


            if (!hasAudio && !audioTransceiver) {

                console.log(
                    "🎙️ Creating audio recvonly transceiver"
                );


                try {

                    peer.addTransceiver(
                        "audio",
                        {
                            direction: "recvonly",
                        }
                    );

                } catch (error) {

                    console.warn(
                        "⚠️ Could not create audio transceiver:",
                        error
                    );

                }

            }


            // =================================================
            // VIDEO
            // =================================================

            if (finalCallType === "video") {

                const videoTransceiver =
                    transceivers.find(
                        (transceiver) =>
                            transceiver.receiver
                                ?.track
                                ?.kind === "video"
                    );


                if (!hasVideo && !videoTransceiver) {

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

                }

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
            // SET REFS FIRST
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

                // -------------------------------------------------
                // MEDIA IS OPTIONAL
                // -------------------------------------------------

                const stream =
                    await getLocalMedia(
                        finalCallType
                    );


                // -------------------------------------------------
                // CREATE PEER
                // -------------------------------------------------

                const peer =
                    createPeerConnection();


                // -------------------------------------------------
                // ADD AVAILABLE LOCAL TRACKS
                // -------------------------------------------------

                addLocalTracks(
                    peer,
                    stream
                );


                // -------------------------------------------------
                // ADD RECEIVE CHANNELS FOR MISSING DEVICES
                // -------------------------------------------------

                ensureReceiveTransceivers(
                    peer,
                    finalCallType,
                    stream
                );


                // -------------------------------------------------
                // CREATE OFFER
                // -------------------------------------------------

                const offer =
                    await peer.createOffer();


                await peer.setLocalDescription(
                    offer
                );


                // -------------------------------------------------
                // SEND OFFER
                // -------------------------------------------------

                const hasLocalAudio =
                    stream
                        .getAudioTracks()
                        .length > 0;


                const hasLocalVideo =
                    stream
                        .getVideoTracks()
                        .length > 0;


                console.log(
                    "📤 Sending CALL OFFER:",
                    {
                        to: target,
                        type: finalCallType,
                        hasLocalAudio,
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
            ensureReceiveTransceivers,
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

                // -------------------------------------------------
                // MEDIA IS OPTIONAL
                // -------------------------------------------------

                const stream =
                    await getLocalMedia(
                        finalCallType
                    );


                // -------------------------------------------------
                // CREATE PEER
                // -------------------------------------------------

                const peer =
                    createPeerConnection();


                // -------------------------------------------------
                // ADD AVAILABLE LOCAL TRACKS
                // -------------------------------------------------

                addLocalTracks(
                    peer,
                    stream
                );


                // -------------------------------------------------
                // SET REMOTE OFFER FIRST
                // -------------------------------------------------

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        offer
                    )
                );


                // -------------------------------------------------
                // ADD RECEIVE TRANSCEIVERS ONLY IF NEEDED
                // -------------------------------------------------

                ensureReceiveTransceivers(
                    peer,
                    finalCallType,
                    stream
                );


                // -------------------------------------------------
                // FLUSH ICE
                // -------------------------------------------------

                await flushPendingCandidates();


                // -------------------------------------------------
                // CREATE ANSWER
                // -------------------------------------------------

                const answer =
                    await peer.createAnswer();


                await peer.setLocalDescription(
                    answer
                );


                // -------------------------------------------------
                // SEND ANSWER
                // -------------------------------------------------

                const hasLocalAudio =
                    stream
                        .getAudioTracks()
                        .length > 0;


                const hasLocalVideo =
                    stream
                        .getVideoTracks()
                        .length > 0;


                console.log(
                    "📤 Sending CALL ANSWER:",
                    {
                        to: callerId,
                        type: finalCallType,
                        hasLocalAudio,
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
            ensureReceiveTransceivers,
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

                    console.warn(
                        "🎙️ Microphone unavailable"
                    );

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


                if (!videoTracks.length) {

                    console.warn(
                        "📷 Camera unavailable"
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


            if (
                localStreamRef.current
            ) {

                localStreamRef.current
                    .getTracks()
                    .forEach(
                        (track) => {

                            try {
                                track.stop();
                            } catch {
                                // ignore
                            }

                        }
                    );

            }


            if (
                remoteStreamRef.current
            ) {

                remoteStreamRef.current
                    .getTracks()
                    .forEach(
                        (track) => {

                            try {
                                track.stop();
                            } catch {
                                // ignore
                            }

                        }
                    );

            }


            if (peerRef.current) {

                try {

                    peerRef.current.close();

                } catch {
                    // ignore
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