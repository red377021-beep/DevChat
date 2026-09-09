import "./AttachmentMenu.css";

import {
    Image,
    Video,
    FileText,
    Music,
    MapPin,
    Contact
} from "lucide-react";

import { useRef, useState } from "react";

import { useChat } from "../../context/ChatContext";


function AttachmentMenu() {

    const {
        addSelectedImages,
        addSelectedVideos,
        setSelectedFile,
        setSelectedAudio,
        setAttachmentOpen,
        sendLocation,

        setAttachmentContact
    } = useChat();


    // =====================================================
    // STATES
    // =====================================================

    const [showContacts, setShowContacts] =
        useState(false);


    // =====================================================
    // CONTACT DATA
    // =====================================================

    const contacts = [
        {
            id: 1,
            name: "Kinza",
            username: "@kinza",
            phone: "+92 300 1234567",
            avatar: "K"
        },

        {
            id: 2,
            name: "Abdullah",
            username: "@abdullah",
            phone: "+92 301 7654321",
            avatar: "A"
        },

        {
            id: 3,
            name: "Mishael",
            username: "@mishael",
            phone: "+92 302 4567890",
            avatar: "M"
        },

        {
            id: 4,
            name: "Amina",
            username: "@amina",
            phone: "+92 303 9876543",
            avatar: "A"
        }
    ];


    // =====================================================
    // INPUT REFS
    // =====================================================

    const imageInput = useRef(null);
    const videoInput = useRef(null);
    const fileInput = useRef(null);
    const audioInput = useRef(null);


    // =====================================================
    // OPEN PICKER
    // =====================================================

    function openPicker(type) {

        switch (type) {

            case "image":
                imageInput.current?.click();
                break;

            case "video":
                videoInput.current?.click();
                break;

            case "file":
                fileInput.current?.click();
                break;

            case "audio":
                audioInput.current?.click();
                break;

            default:
                break;

        }

    }


    // =====================================================
    // MULTIPLE IMAGES
    // =====================================================

    function handleImage(event) {

        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) {
            return;
        }


        const imageFiles = files.filter(
            file =>
                file &&
                file.type &&
                file.type.startsWith("image/")
        );


        if (!imageFiles.length) {
            event.target.value = "";
            return;
        }


        addSelectedImages(imageFiles);

        setAttachmentOpen(false);

        event.target.value = "";

    }


    // =====================================================
    // MULTIPLE VIDEOS
    // =====================================================

    function handleVideo(event) {

        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) {
            return;
        }


        const videoFiles = files.filter(
            file =>
                file &&
                file.type &&
                file.type.startsWith("video/")
        );


        if (!videoFiles.length) {
            event.target.value = "";
            return;
        }


        addSelectedVideos(videoFiles);

        setAttachmentOpen(false);

        event.target.value = "";

    }


    // =====================================================
    // DOCUMENT
    // =====================================================

    function handleFile(event) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        setSelectedFile(file);

        setAttachmentOpen(false);

        event.target.value = "";

    }


    // =====================================================
    // AUDIO
    // =====================================================

    function handleAudio(event) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        setSelectedAudio(file);

        setAttachmentOpen(false);

        event.target.value = "";

    }


    // =====================================================
    // LOCATION
    // =====================================================

    function handleLocation() {

        if (
            typeof sendLocation !==
            "function"
        ) {

            console.error(
                "sendLocation function is not available."
            );

            return;
        }


        sendLocation();

        setAttachmentOpen(false);

    }


    // =====================================================
    // CONTACT OPEN
    // =====================================================

    function handleContact() {

        setShowContacts(true);

    }


    // =====================================================
    // CONTACT SELECT
    // =====================================================

    function selectContact(contact) {

        if (
            !contact ||
            typeof setAttachmentContact !==
            "function"
        ) {

            return;

        }


        setAttachmentContact({

            id: contact.id,

            name: contact.name,

            username: contact.username,

            phone: contact.phone,

            avatar: contact.avatar

        });


        setShowContacts(false);

        setAttachmentOpen(false);

    }


    // =====================================================
    // CONTACT PICKER
    // =====================================================

    if (showContacts) {

        return (

            <div className="contact-picker">

                {/* HEADER */}

                <div className="contact-picker-header">

                    <button
                        type="button"
                        className="contact-back-btn"
                        onClick={() =>
                            setShowContacts(false)
                        }
                    >
                        ←
                    </button>


                    <div className="contact-picker-title">

                        <Contact size={18} />

                        <span>
                            Select Contact
                        </span>

                    </div>

                </div>


                {/* CONTACT LIST */}

                <div className="contact-list">

                    {contacts.map(contact => (

                        <button
                            key={contact.id}
                            type="button"
                            className="contact-picker-item"
                            onClick={() =>
                                selectContact(
                                    contact
                                )
                            }
                        >

                            {/* AVATAR */}

                            <div className="contact-picker-avatar">

                                {contact.avatar}

                            </div>


                            {/* INFO */}

                            <div className="contact-picker-info">

                                <strong>
                                    {contact.name}
                                </strong>

                                <span>
                                    {contact.username}
                                </span>

                            </div>


                            {/* ARROW */}

                            <span className="contact-picker-arrow">
                                ›
                            </span>

                        </button>

                    ))}

                </div>

            </div>

        );

    }


    // =====================================================
    // NORMAL MENU
    // =====================================================

    return (

        <>

            {/* IMAGE INPUT */}

            <input
                ref={imageInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImage}
            />


            {/* VIDEO INPUT */}

            <input
                ref={videoInput}
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={handleVideo}
            />


            {/* DOCUMENT INPUT */}

            <input
                ref={fileInput}
                type="file"
                hidden
                onChange={handleFile}
            />


            {/* AUDIO INPUT */}

            <input
                ref={audioInput}
                type="file"
                accept="audio/*"
                hidden
                onChange={handleAudio}
            />


            {/* ATTACHMENT MENU */}

            <div className="attachment-menu">


                {/* PHOTOS */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={() =>
                        openPicker("image")
                    }
                >

                    <span className="attachment-icon">
                        <Image size={20} />
                    </span>

                    <span className="attachment-label">
                        Photos
                    </span>

                </button>


                {/* VIDEOS */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={() =>
                        openPicker("video")
                    }
                >

                    <span className="attachment-icon">
                        <Video size={20} />
                    </span>

                    <span className="attachment-label">
                        Videos
                    </span>

                </button>


                {/* DOCUMENTS */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={() =>
                        openPicker("file")
                    }
                >

                    <span className="attachment-icon">
                        <FileText size={20} />
                    </span>

                    <span className="attachment-label">
                        Documents
                    </span>

                </button>


                {/* AUDIO */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={() =>
                        openPicker("audio")
                    }
                >

                    <span className="attachment-icon">
                        <Music size={20} />
                    </span>

                    <span className="attachment-label">
                        Audio
                    </span>

                </button>


                {/* LOCATION */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={handleLocation}
                >

                    <span className="attachment-icon">
                        <MapPin size={20} />
                    </span>

                    <span className="attachment-label">
                        Location
                    </span>

                </button>


                {/* CONTACT */}

                <button
                    type="button"
                    className="attachment-item"
                    onClick={handleContact}
                >

                    <span className="attachment-icon">
                        <Contact size={20} />
                    </span>

                    <span className="attachment-label">
                        Contact
                    </span>

                </button>


            </div>

        </>

    );

}


export default AttachmentMenu;