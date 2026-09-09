import "./BubbleLocation.css";

import {
    MapPin,
    Navigation
} from "lucide-react";


function BubbleLocation({ location }) {

    if (
        !location ||
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
    ) {
        return null;
    }


    const {
        latitude,
        longitude
    } = location;


    const mapsUrl =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    return (

        <div className="bubble-location">

            {/* ==========================================
                MAP PREVIEW
            ========================================== */}

            <div className="bubble-location-map">

                <div
                    className="
                        bubble-location-road
                        road-one
                    "
                />

                <div
                    className="
                        bubble-location-road
                        road-two
                    "
                />


                <div className="bubble-location-pin">

                    <MapPin size={25} />

                </div>

            </div>


            {/* ==========================================
                LOCATION INFO
            ========================================== */}

            <div className="bubble-location-info">

                <div className="bubble-location-heading">

                    <div className="bubble-location-icon">

                        <MapPin size={17} />

                    </div>


                    <div>

                        <strong>
                            Shared Location
                        </strong>

                        <span>
                            Current location
                        </span>

                    </div>

                </div>


                {/* COORDINATES */}

                <div className="bubble-location-coordinates">

                    {latitude.toFixed(6)}
                    {" , "}
                    {longitude.toFixed(6)}

                </div>


                {/* OPEN MAPS */}

                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bubble-location-button"
                >

                    <Navigation size={15} />

                    <span>
                        Open in Maps
                    </span>

                </a>

            </div>

        </div>

    );
}


/* ==========================================
   DEFAULT EXPORT
========================================== */

export default BubbleLocation;