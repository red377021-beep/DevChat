// ======================================================
// DEVCHAT CALL CONTEXT
// Real 1-to-1 Audio / Video Calling
// ======================================================

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import socket from "../utils/socket";

import useWebRTC from "../hooks/useWebRTC";


// ======================================================
// CONTEXT
// ======================================================

const CallContext = createContext(null);


// ======================================================
// CURRENT USER
// ======================================================

function getCurrentUser() {

    try {

        const storedUser =
            localStorage.getItem("devchat_user");

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "❌ Failed to read current user:",
            error
        );

        return null;
    }
}


// ======================================================
// NORMALIZE USER ID
// ======================================================

function normalizeUserId(userId) {

    if (
        userId === undefined ||
        userId === null ||
        userId === ""
    ) {
        return null;
    }

    return String(userId);
}


// ======================================================
// PROVIDER
// ======================================================

export function CallProvider({ children }) {

    // ==================================================
    // CURRENT USER
    // ==================================================

    const currentUser =
        getCurrentUser();

    const currentUserId =
        normalizeUserId(
            currentUser?.id ||
            currentUser?._id ||
            currentUser?.userId
        );


    // ==================================================
    // CALL STATE
    // ==================================================

    const [callState, setCallState] =
        useState("idle");

    /*
        idle
        calling
        ringing
        connecting
        connected
        ended
        declined
        failed
    */


    // ==================================================
    // CALL TYPE
    // ==================================================

    const [activeCallType, setActiveCallType] =
        useState(null);

    /*
        null
        audio
        video
    */


    // ==================================================
    // PEER
    // ==================================================

    const [callPeerUserId, setCallPeerUserId] =
        useState(null);

    const [callPeerName, setCallPeerName] =
        useState("");

    const [callPeerAvatar, setCallPeerAvatar] =
        useState("");


    // ==================================================
    // INCOMING CALL
    // ==================================================

    const [incomingCall, setIncomingCall] =
        useState(null);


    // ==================================================
    // OUTGOING CALL
    // ==================================================

    const [outgoingCall, setOutgoingCall] =
        useState(null);


    // ==================================================
    // ACTIVE CALL
    // ==================================================

    const [activeCall, setActiveCall] =
        useState(null);


    // ==================================================
    // REFS
    // ==================================================

    const activeCallTypeRef =
        useRef(null);

    const callPeerUserIdRef =
        useRef(null);

    const callStateRef =
        useRef("idle");

    const incomingCallRef =
        useRef(null);

    const outgoingCallRef =
        useRef(null);

    const activeCallRef =
        useRef(null);

    const mountedRef =
        useRef(false);


    // ==================================================
    // KEEP REFS SYNCHRONIZED
    // ==================================================

    useEffect(() => {

        activeCallTypeRef.current =
            activeCallType;

    }, [activeCallType]);


    useEffect(() => {

        callPeerUserIdRef.current =
            callPeerUserId;

    }, [callPeerUserId]);


    useEffect(() => {

        callStateRef.current =
            callState;

    }, [callState]);


    useEffect(() => {

        incomingCallRef.current =
            incomingCall;

    }, [incomingCall]);


    useEffect(() => {

        outgoingCallRef.current =
            outgoingCall;

    }, [outgoingCall]);


    useEffect(() => {

        activeCallRef.current =
            activeCall;

    }, [activeCall]);


    // ==================================================
    // WEBRTC
    // ==================================================

   const {
    localStream,
    remoteStream,
    connectionState,

    startCall: startWebRTCCall,
    acceptCall: acceptWebRTCCall,

    toggleMicrophone,
    toggleCamera,

    cleanup: cleanupWebRTC

} = useWebRTC({

    // ==================================================
    // SOCKET.IO
    // ==================================================

    socket,

    // ==================================================
    // CURRENT USER
    // ==================================================

    currentUserId,

    // ==================================================
    // CALL PEER
    // ==================================================

    targetUserId:
        callPeerUserId,

    // ==================================================
    // CALL TYPE
    // ==================================================

    callType:
        activeCallType,

    // ==================================================
    // ENABLED
    // ==================================================

    enabled:
        Boolean(
            activeCallType &&
            callPeerUserId
        )

});


    // ==================================================
    // START CALL
    // ==================================================

    const startCall = useCallback(
        async ({
            userId,
            name = "",
            avatar = "",
            type = "audio"
        }) => {

            const targetUserId =
                normalizeUserId(userId);


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!currentUserId) {

                console.error(
                    "❌ Cannot start call: current user missing"
                );

                return false;
            }


            if (!targetUserId) {

                console.error(
                    "❌ Cannot start call: target user missing"
                );

                return false;
            }


            if (
                targetUserId ===
                currentUserId
            ) {

                console.error(
                    "❌ Cannot call yourself"
                );

                return false;
            }


            if (
                callStateRef.current !==
                "idle"
            ) {

                console.warn(
                    "⚠️ Already in a call"
                );

                return false;
            }


            // ------------------------------------------
            // PREPARE CALL
            // ------------------------------------------

            const callData = {

                userId:
                    targetUserId,

                name:
                    name || "Unknown User",

                avatar:
                    avatar || "",

                type:
                    type === "video"
                        ? "video"
                        : "audio"

            };


            // ------------------------------------------
            // SET REFS FIRST
            // ------------------------------------------

            activeCallTypeRef.current =
                callData.type;

            callPeerUserIdRef.current =
                callData.userId;


            // ------------------------------------------
            // SET STATE
            // ------------------------------------------

            setActiveCallType(
                callData.type
            );

            setCallPeerUserId(
                callData.userId
            );

            setCallPeerName(
                callData.name
            );

            setCallPeerAvatar(
                callData.avatar
            );


            setOutgoingCall(
                callData
            );


            setActiveCall(
                callData
            );


            setCallState(
                "calling"
            );


            // ------------------------------------------
            // START WEBRTC
            // ------------------------------------------

            console.log(
                "📞 Starting WebRTC call:",
                callData
            );


            try {

                const started =
    await startWebRTCCall(
        callData.userId,
        callData.type
    );

                if (!started) {

                    console.error(
                        "❌ WebRTC call failed to start"
                    );

                    socket.emit(
                        "call:end",
                        {
                            to:
                                callData.userId
                        }
                    );

                    cleanupCallState(
                        "failed"
                    );

                    return false;
                }


                console.log(
                    "✅ WebRTC offer created"
                );

                return true;

            } catch (error) {

                console.error(
                    "❌ Start call error:",
                    error
                );

                cleanupCallState(
                    "failed"
                );

                return false;
            }

        },
        [
            currentUserId,
            startWebRTCCall
        ]
    );


    // ==================================================
    // AUDIO CALL
    // ==================================================

    const startAudioCall =
        useCallback(
            async ({
                userId,
                name,
                avatar
            }) => {

                return startCall({

                    userId,
                    name,
                    avatar,

                    type:
                        "audio"

                });

            },
            [startCall]
        );


    // ==================================================
    // VIDEO CALL
    // ==================================================

    const startVideoCall =
        useCallback(
            async ({
                userId,
                name,
                avatar
            }) => {

                return startCall({

                    userId,
                    name,
                    avatar,

                    type:
                        "video"

                });

            },
            [startCall]
        );


    // ==================================================
    // INCOMING OFFER
    // ==================================================

    useEffect(() => {

        mountedRef.current =
            true;


        const handleIncomingOffer =
            (data) => {

                if (!mountedRef.current) {
                    return;
                }


                if (!data?.offer) {

                    console.warn(
                        "⚠️ Incoming call without offer"
                    );

                    return;
                }


                const callerId =
                    normalizeUserId(
                        data.fromUserId
                    );


                // --------------------------------------
                // INVALID CALLER
                // --------------------------------------

                if (!callerId) {

                    console.warn(
                        "⚠️ Incoming call without caller ID"
                    );

                    return;
                }


                // --------------------------------------
                // IGNORE OWN CALL
                // --------------------------------------

                if (
                    callerId ===
                    currentUserId
                ) {

                    console.log(
                        "ℹ️ Ignoring own call offer"
                    );

                    return;
                }


                // --------------------------------------
                // BUSY
                // --------------------------------------

                if (
                    callStateRef.current !==
                    "idle"
                ) {

                    console.log(
                        "📵 Already busy. Rejecting incoming call."
                    );


                    socket.emit(
                        "call:decline",
                        {
                            to:
                                callerId
                        }
                    );

                    return;
                }


                // --------------------------------------
                // CALL TYPE
                // --------------------------------------

                const type =
                    data.callType === "video"
                        ? "video"
                        : "audio";


                // --------------------------------------
                // CALLER INFO
                // --------------------------------------

                const caller =
                    data.caller || {};


                const callerData = {

                    userId:
                        callerId,

                    name:
                        caller.name ||
                        caller.username ||
                        "Unknown User",

                    avatar:
                        caller.avatar ||
                        caller.profilePicture ||
                        "",

                    type,

                    offer:
                        data.offer

                };


                // --------------------------------------
                // SET REFS FIRST
                // --------------------------------------

                activeCallTypeRef.current =
                    type;

                callPeerUserIdRef.current =
                    callerId;


                incomingCallRef.current =
                    callerData;


                // --------------------------------------
                // SET STATE
                // --------------------------------------

                setActiveCallType(
                    type
                );

                setCallPeerUserId(
                    callerId
                );

                setCallPeerName(
                    callerData.name
                );

                setCallPeerAvatar(
                    callerData.avatar
                );


                setIncomingCall(
                    callerData
                );


                setCallState(
                    "ringing"
                );


                console.log(
                    "📲 INCOMING CALL:",
                    {
                        from:
                            callerId,

                        type
                    }
                );

            };


        socket.on(
            "call:offer",
            handleIncomingOffer
        );


        return () => {

            mountedRef.current =
                false;

            socket.off(
                "call:offer",
                handleIncomingOffer
            );

        };

    }, [currentUserId]);


    // ==================================================
    // ACCEPT CALL
    // ==================================================

    const acceptCall =
        useCallback(
            async () => {

                const call =
                    incomingCallRef.current;


                if (!call) {

                    console.error(
                        "❌ No incoming call to accept"
                    );

                    return false;
                }


                const callerId =
                    normalizeUserId(
                        call.userId
                    );


                if (!callerId) {

                    console.error(
                        "❌ Caller ID missing"
                    );

                    return false;
                }


                // --------------------------------------
                // SET ACTIVE CALL
                // --------------------------------------

                activeCallTypeRef.current =
                    call.type;

                callPeerUserIdRef.current =
                    callerId;


                setActiveCallType(
                    call.type
                );

                setCallPeerUserId(
                    callerId
                );

                setCallPeerName(
                    call.name
                );

                setCallPeerAvatar(
                    call.avatar
                );


                setActiveCall(
                    call
                );


                setIncomingCall(
                    null
                );


                setCallState(
                    "connecting"
                );


                // --------------------------------------
                // ACCEPT WEBRTC
                // --------------------------------------

                console.log(
                    "📞 Accepting call:",
                    {
                        from:
                            callerId,

                        type:
                            call.type
                    }
                );


                try {

                    const accepted =
    await acceptWebRTCCall(
        call.offer,
        callerId,
        call.type
    );

                    if (!accepted) {

                        console.error(
                            "❌ WebRTC accept failed"
                        );


                        socket.emit(
                            "call:decline",
                            {
                                to:
                                    callerId
                            }
                        );


                        cleanupCallState(
                            "failed"
                        );

                        return false;
                    }


                    console.log(
                        "✅ Call accepted"
                    );


                    return true;

                } catch (error) {

                    console.error(
                        "❌ Accept call error:",
                        error
                    );


                    socket.emit(
                        "call:decline",
                        {
                            to:
                                callerId
                        }
                    );


                    cleanupCallState(
                        "failed"
                    );

                    return false;
                }

            },
            [
                acceptWebRTCCall
            ]
        );


    // ==================================================
    // ACCEPT AUDIO
    // ==================================================

    const acceptAudioCall =
        useCallback(
            async () => {

                if (
                    incomingCallRef.current
                        ?.type !==
                    "audio"
                ) {
                    return false;
                }

                return acceptCall();

            },
            [acceptCall]
        );


    // ==================================================
    // ACCEPT VIDEO
    // ==================================================

    const acceptVideoCall =
        useCallback(
            async () => {

                if (
                    incomingCallRef.current
                        ?.type !==
                    "video"
                ) {
                    return false;
                }

                return acceptCall();

            },
            [acceptCall]
        );


    // ==================================================
    // DECLINE CALL
    // ==================================================

    const declineCall =
        useCallback(
            () => {

                const call =
                    incomingCallRef.current;


                if (!call) {

                    console.warn(
                        "⚠️ No incoming call to decline"
                    );

                    return;
                }


                const callerId =
                    normalizeUserId(
                        call.userId
                    );


                if (callerId) {

                    socket.emit(
                        "call:decline",
                        {
                            to:
                                callerId
                        }
                    );

                    console.log(
                        "📵 CALL DECLINED:",
                        callerId
                    );
                }


                cleanupCallState(
                    "declined"
                );

            },
            []
        );


    // ==================================================
    // END CALL
    // ==================================================

    const endCall =
        useCallback(
            () => {

                const peerId =
                    callPeerUserIdRef.current;


                if (peerId) {

                    socket.emit(
                        "call:end",
                        {
                            to:
                                peerId
                        }
                    );


                    console.log(
                        "📴 CALL END SENT:",
                        peerId
                    );
                }


                cleanupCallState(
                    "ended"
                );

            },
            []
        );


    // ==================================================
    // REMOTE DECLINE
    // ==================================================

    useEffect(() => {

        const handleRemoteDecline =
            (data) => {

                const peerId =
                    callPeerUserIdRef.current;


                if (
                    !peerId ||
                    !data?.fromUserId
                ) {
                    return;
                }


                if (
                    String(data.fromUserId) !==
                    String(peerId)
                ) {
                    return;
                }


                console.log(
                    "📵 REMOTE CALL DECLINED"
                );


                cleanupCallState(
                    "declined"
                );

            };


        socket.on(
            "call:decline",
            handleRemoteDecline
        );


        return () => {

            socket.off(
                "call:decline",
                handleRemoteDecline
            );

        };

    }, []);


    // ==================================================
    // REMOTE END
    // ==================================================

    useEffect(() => {

        const handleRemoteEnd =
            (data) => {

                const peerId =
                    callPeerUserIdRef.current;


                if (
                    !peerId ||
                    !data?.fromUserId
                ) {
                    return;
                }


                if (
                    String(data.fromUserId) !==
                    String(peerId)
                ) {
                    return;
                }


                console.log(
                    "📴 REMOTE CALL ENDED"
                );


                cleanupCallState(
                    "ended"
                );

            };


        socket.on(
            "call:end",
            handleRemoteEnd
        );


        return () => {

            socket.off(
                "call:end",
                handleRemoteEnd
            );

        };

    }, []);


    // ==================================================
    // WEBRTC CONNECTION STATE
    // ==================================================

    useEffect(() => {

        if (
            connectionState ===
            "connected"
        ) {

            setCallState(
                "connected"
            );

            return;
        }


        if (
            connectionState ===
            "connecting"
        ) {

            setCallState(
                "connecting"
            );

            return;
        }


        if (
            connectionState ===
            "failed"
        ) {

            setCallState(
                "failed"
            );

        }

    }, [connectionState]);


    // ==================================================
    // CLEANUP
    // ==================================================

    const cleanupCallState =
        useCallback(
            (finalState = "ended") => {

                console.log(
                    "🧹 Cleaning call state:",
                    finalState
                );


                try {

                    cleanupWebRTC();

                } catch (error) {

                    console.error(
                        "❌ WebRTC cleanup error:",
                        error
                    );

                }


                setIncomingCall(
                    null
                );

                setOutgoingCall(
                    null
                );

                setActiveCall(
                    null
                );


                setCallPeerUserId(
                    null
                );

                setCallPeerName(
                    ""
                );

                setCallPeerAvatar(
                    ""
                );

                setActiveCallType(
                    null
                );


                activeCallTypeRef.current =
                    null;

                callPeerUserIdRef.current =
                    null;

                incomingCallRef.current =
                    null;

                outgoingCallRef.current =
                    null;

                activeCallRef.current =
                    null;


                setCallState(
                    finalState
                );


                // --------------------------------------
                // Return to idle shortly after UI
                // --------------------------------------

                setTimeout(() => {

                    if (
                        mountedRef.current
                    ) {

                        setCallState(
                            "idle"
                        );

                    }

                }, 250);

            },
            [
                cleanupWebRTC
            ]
        );


    // ==================================================
    // MICROPHONE
    // ==================================================

    const setMicrophone =
        useCallback(
            (enabled) => {

                toggleMicrophone(
                    enabled
                );

            },
            [toggleMicrophone]
        );


    // ==================================================
    // CAMERA
    // ==================================================

    const setCamera =
        useCallback(
            (enabled) => {

                toggleCamera(
                    enabled
                );

            },
            [toggleCamera]
        );


    // ==================================================
    // COMPATIBILITY STATES
    // ==================================================

    const audioCallOpen =
        Boolean(
            activeCall &&
            activeCallType === "audio"
        );


    const videoCallOpen =
        Boolean(
            activeCall &&
            activeCallType === "video"
        );


    const incomingAudioCallOpen =
        Boolean(
            incomingCall &&
            incomingCall.type === "audio"
        );


    const incomingVideoCallOpen =
        Boolean(
            incomingCall &&
            incomingCall.type === "video"
        );


    // ==================================================
    // MEMOIZED CONTEXT
    // ==================================================

    const contextValue =
        useMemo(
            () => ({

                // --------------------------------------
                // CALL STATE
                // --------------------------------------

                callState,
                activeCallType,

                callPeerUserId,
                callPeerName,
                callPeerAvatar,

                incomingCall,
                outgoingCall,
                activeCall,


                // --------------------------------------
                // COMPATIBILITY
                // --------------------------------------

                audioCallOpen,
                videoCallOpen,

                incomingAudioCallOpen,
                incomingVideoCallOpen,


                // --------------------------------------
                // START
                // --------------------------------------

                startCall,

                startAudioCall,
                startVideoCall,


                // --------------------------------------
                // ACCEPT
                // --------------------------------------

                acceptCall,
                acceptAudioCall,
                acceptVideoCall,


                // --------------------------------------
                // END / DECLINE
                // --------------------------------------

                declineCall,
                endCall,


                // --------------------------------------
                // WEBRTC
                // --------------------------------------

                localStream,
                remoteStream,
                connectionState,

                setMicrophone,
                setCamera,

                toggleMicrophone,
                toggleCamera,

                cleanupWebRTC,


                // --------------------------------------
                // LEGACY NAMES
                // --------------------------------------

                showIncomingAudioCall:
                    () => {},

                showIncomingVideoCall:
                    () => {}

            }),
            [
                callState,
                activeCallType,

                callPeerUserId,
                callPeerName,
                callPeerAvatar,

                incomingCall,
                outgoingCall,
                activeCall,

                audioCallOpen,
                videoCallOpen,

                incomingAudioCallOpen,
                incomingVideoCallOpen,

                startCall,
                startAudioCall,
                startVideoCall,

                acceptCall,
                acceptAudioCall,
                acceptVideoCall,

                declineCall,
                endCall,

                localStream,
                remoteStream,
                connectionState,

                setMicrophone,
                setCamera,

                toggleMicrophone,
                toggleCamera,

                cleanupWebRTC
            ]
        );


    // ==================================================
    // PROVIDER
    // ==================================================

    return (

        <CallContext.Provider
            value={contextValue}
        >

            {children}

        </CallContext.Provider>

    );

}


// ======================================================
// HOOK
// ======================================================

export function useCall() {

    const context =
        useContext(CallContext);


    if (!context) {

        throw new Error(
            "useCall must be used inside CallProvider"
        );

    }


    return context;
}


export default CallContext;