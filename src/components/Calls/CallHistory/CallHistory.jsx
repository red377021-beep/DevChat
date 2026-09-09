import "./CallHistory.css";

import {
    Search,
    Phone,
    Video,
    PhoneMissed,
    X,
    Filter,
} from "lucide-react";

import { useMemo, useState } from "react";

import CallCard from "../CallCard/CallCard";


function CallHistory({
    calls = [],
    onCall,
    onVideoCall,
    onMore,
}) {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const safeCalls = Array.isArray(calls) ? calls : [];


    const filteredCalls = useMemo(() => {

        const query = search.trim().toLowerCase();

        return safeCalls.filter((call = {}) => {

            const name = String(call.name || "").toLowerCase();
            const username = String(call.username || "").toLowerCase();
            const direction = String(call.direction || "").toLowerCase();
            const status = String(call.status || "").toLowerCase();
            const type = String(call.type || "").toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                username.includes(query);

            const isMissed =
                call.missed ||
                status === "missed" ||
                direction === "missed";

            const matchesFilter =
                filter === "all" ||
                (filter === "missed" && isMissed) ||
                (filter === "incoming" && direction === "incoming") ||
                (filter === "outgoing" && direction === "outgoing") ||
                (filter === "video" && type === "video");

            return matchesSearch && matchesFilter;
        });

    }, [safeCalls, search, filter]);


    return (
        <section className="call-history">

            <div className="call-history-toolbar">

                <div className="call-history-search">

                    <Search size={17} />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search calls..."
                        aria-label="Search calls"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}

                </div>


                <div className="call-history-filters">

                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        <Filter size={14} />
                        All
                    </button>

                    <button
                        className={filter === "missed" ? "active" : ""}
                        onClick={() => setFilter("missed")}
                    >
                        <PhoneMissed size={14} />
                        Missed
                    </button>

                    <button
                        className={filter === "incoming" ? "active" : ""}
                        onClick={() => setFilter("incoming")}
                    >
                        <Phone size={14} />
                        Incoming
                    </button>

                    <button
                        className={filter === "outgoing" ? "active" : ""}
                        onClick={() => setFilter("outgoing")}
                    >
                        <Phone size={14} />
                        Outgoing
                    </button>

                    <button
                        className={filter === "video" ? "active" : ""}
                        onClick={() => setFilter("video")}
                    >
                        <Video size={14} />
                        Video
                    </button>

                </div>

            </div>


            <div className="call-history-header">

                <div>
                    <h2>Recent Calls</h2>
                    <span>
                        {filteredCalls.length}{" "}
                        {filteredCalls.length === 1 ? "call" : "calls"}
                    </span>
                </div>

            </div>


            <div className="call-history-list">

                {filteredCalls.length > 0 ? (

                    filteredCalls.map((call, index) => (
                        <CallCard
                            key={call.id || `call-${index}`}
                            call={call}
                            onCall={onCall}
                            onVideoCall={onVideoCall}
                            onMore={onMore}
                        />
                    ))

                ) : (

                    <div className="call-history-empty">

                        <div className="call-history-empty-icon">
                            <Phone size={25} />
                        </div>

                        <h3>No calls found</h3>

                        <p>
                            {search
                                ? "Try a different search."
                                : "Your call history will appear here."}
                        </p>

                    </div>

                )}

            </div>

        </section>
    );
}


export default CallHistory;