
import "./ContactPicker.css";

import {
    X,
    UserRound,
    Search,
    Check
} from "lucide-react";

import { useMemo, useState } from "react";


function ContactPicker({
    onSelect,
    onClose
}) {

    const [search, setSearch] =
        useState("");

    // =====================================================
    // DEMO CONTACTS
    // =====================================================

    const contacts = [
        {
            id: 1,
            name: "Kinza",
            username: "@kinza",
            avatar: "K"
        },
        {
            id: 2,
            name: "Mishael",
            username: "@mishael",
            avatar: "M"
        },
        {
            id: 3,
            name: "Pihuu",
            username: "@pihuu",
            avatar: "P"
        },
        {
            id: 4,
            name: "Amina",
            username: "@amina",
            avatar: "A"
        }
    ];


    // =====================================================
    // FILTER
    // =====================================================

    const filteredContacts =
        useMemo(() => {

            const value =
                search
                    .trim()
                    .toLowerCase();

            if (!value) {
                return contacts;
            }

            return contacts.filter(contact =>
                contact.name
                    .toLowerCase()
                    .includes(value) ||
                contact.username
                    .toLowerCase()
                    .includes(value)
            );

        }, [search]);


    // =====================================================
    // SELECT
    // =====================================================

    function handleSelect(contact) {

        if (!contact) {
            return;
        }

        onSelect?.(contact);
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="contact-picker-overlay">

            <div className="contact-picker">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="contact-picker-header">

                    <div className="contact-picker-title">

                        <div className="contact-picker-title-icon">

                            <UserRound size={19} />

                        </div>

                        <div>

                            <strong>
                                Share Contact
                            </strong>

                            <span>
                                Select a contact to share
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="contact-picker-close"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="contact-picker-search">

                    <Search size={17} />

                    <input
                        type="text"
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search contacts..."
                        autoFocus
                    />

                </div>


                {/* =================================================
                    CONTACT LIST
                ================================================= */}

                <div className="contact-picker-list">

                    {filteredContacts.length > 0 ? (

                        filteredContacts.map(
                            contact => (

                                <button
                                    key={contact.id}
                                    type="button"
                                    className="contact-picker-item"
                                    onClick={() =>
                                        handleSelect(
                                            contact
                                        )
                                    }
                                >

                                    <div className="contact-picker-avatar">

                                        {contact.avatar}

                                    </div>


                                    <div className="contact-picker-info">

                                        <strong>
                                            {contact.name}
                                        </strong>

                                        <span>
                                            {contact.username}
                                        </span>

                                    </div>


                                    <div className="contact-picker-check">

                                        <Check size={16} />

                                    </div>

                                </button>

                            )
                        )

                    ) : (

                        <div className="contact-picker-empty">

                            <UserRound size={30} />

                            <strong>
                                No contacts found
                            </strong>

                            <span>
                                Try another search
                            </span>

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="contact-picker-footer">

                    <span>
                        {filteredContacts.length}{" "}
                        {filteredContacts.length === 1
                            ? "contact"
                            : "contacts"}
                    </span>

                </div>

            </div>

        </div>

    );

}


export default ContactPicker;

