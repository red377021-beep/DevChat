import "./Calls.css";

import { useMemo, useState } from "react";

import CallHeader from "../../components/Calls/CallHeader/CallHeader";
import CallHistory from "../../components/Calls/CallHistory/CallHistory";
import IncomingCall from "../../components/Calls/IncomingCall/IncomingCall";
import ActiveCall from "../../components/Calls/ActiveCall/ActiveCall";
import CallInfo from "../../components/Calls/CallInfo/CallInfo";


const initialCalls = [
    {
        id: 1,
        name: "Kinza",
        username: "kinza",
        initials: "K",
        type: "video",
        status: "incoming",
        duration: "12:48",
        date: "Today",
        time: "11:42 AM",
    },
    {
        id: 2,
        name: "Mishael",
        username: "mishael",
        initials: "M",
        type: "voice",
        status: "outgoing",
        duration: "05:21",
        date: "Today",
        time: "10:18 AM",
    },
    {
        id: 3,
        name: "Amina",
        username: "amina",
        initials: "A",
        type: "video",
        status: "missed",
        duration: "00:00",
        date: "Yesterday",
        time: "08:36 PM",
    },
];


function Calls() {

    const [calls] = useState(initialCalls);

    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const [selectedCall, setSelectedCall] = useState(null);


    const subtitle = useMemo(() => {
        return `${calls.length} recent calls`;
    }, [calls.length]);


    const startCall = (call, video = false) => {

        setIncomingCall(null);

        setActiveCall({
            ...call,
            type: video ? "video" : "voice",
        });
    };


    const handleCall = (call) => {
        startCall(call, false);
    };


    const handleVideoCall = (call) => {
        startCall(call, true);
    };


    const handleAcceptIncoming = () => {

        if (!incomingCall) return;

        startCall(
            incomingCall,
            incomingCall.type === "video"
        );
    };


    const handleRejectIncoming = () => {
        setIncomingCall(null);
    };


    const handleEndCall = () => {
        setActiveCall(null);
    };


    const handleShowInfo = (call) => {
        setSelectedCall(call);
    };


    const handleBackInfo = () => {
        setSelectedCall(null);
    };


    return (
        <main className="calls-page">

            {selectedCall ? (
                <CallInfo
                    call={selectedCall}
                    onBack={handleBackInfo}
                    onCall={() => handleCall(selectedCall)}
                    onVideoCall={() => handleVideoCall(selectedCall)}
                    onMessage={() => {}}
                    onMore={() => {}}
                />
            ) : (
                <>
                    <CallHeader
                        title="Calls"
                        subtitle={subtitle}
                        onBack={() => {}}
                        onSearch={() => {}}
                        onMore={() => {}}
                        onVoiceCall={() => {
                            if (calls[0]) {
                                handleCall(calls[0]);
                            }
                        }}
                        onVideoCall={() => {
                            if (calls[0]) {
                                handleVideoCall(calls[0]);
                            }
                        }}
                    />

                    <CallHistory
                        calls={calls}
                        onCall={handleCall}
                        onVideoCall={handleVideoCall}
                        onMore={handleShowInfo}
                    />
                </>
            )}


            {incomingCall && (
                <IncomingCall
                    call={incomingCall}
                    onAccept={handleAcceptIncoming}
                    onReject={handleRejectIncoming}
                />
            )}


            {activeCall && (
                <ActiveCall
                    call={activeCall}
                    onEnd={handleEndCall}
                    onToggleMute={() => {}}
                    onToggleCamera={() => {}}
                    onToggleSpeaker={() => {}}
                    onMore={() => {}}
                />
            )}

        </main>
    );
}


export default Calls;