import "./TranslatePanel.css";

import { X, Languages, Copy } from "lucide-react";

import { useChat } from "../../context/ChatContext";

function TranslatePanel() {

    const {
        translateMessage,
        translateOpen,
        closeTranslate,
        translateLanguage,
        setTranslateLanguage,
        translatedMessages,
        saveTranslation
    } = useChat();

    if (!translateOpen || !translateMessage) {
        return null;
    }

    const translatedText =
        translatedMessages?.[translateMessage.id] || "";

    function handleTranslate() {

        if (!translateMessage.text?.trim()) {
            return;
        }

        // Temporary translation engine
        // Real translation API baad mein connect karenge.

        saveTranslation(
            translateMessage.id,
            `[${translateLanguage}] ${translateMessage.text}`
        );

    }

    async function handleCopy() {

        if (!translatedText) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                translatedText
            );

        } catch (error) {

            console.error("Copy failed:", error);

        }

    }

    return (

        <div className="translate-overlay">

            <div className="translate-panel">

                {/* HEADER */}

                <div className="translate-header">

                    <div className="translate-title">

                        <Languages size={20} />

                        <span>
                            Translate Message
                        </span>

                    </div>

                    <button
                        type="button"
                        className="translate-close"
                        onClick={closeTranslate}
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* ORIGINAL */}

                <div className="translate-section">

                    <span className="translate-label">
                        Original
                    </span>

                    <div className="translate-original">

                        {translateMessage.text || "No text"}

                    </div>

                </div>


                {/* LANGUAGE */}

                <div className="translate-section">

                    <span className="translate-label">
                        Translate to
                    </span>

                    <select
                        value={translateLanguage}
                        onChange={(event) =>
                            setTranslateLanguage(
                                event.target.value
                            )
                        }
                    >

                        <option value="English">
                            English
                        </option>

                        <option value="Urdu">
                            Urdu
                        </option>

                        <option value="Roman Urdu">
                            Roman Urdu
                        </option>

                        <option value="Hindi">
                            Hindi
                        </option>

                        <option value="Arabic">
                            Arabic
                        </option>

                        <option value="Spanish">
                            Spanish
                        </option>

                        <option value="French">
                            French
                        </option>

                    </select>

                </div>


                {/* TRANSLATE BUTTON */}

                <button
                    type="button"
                    className="translate-btn"
                    onClick={handleTranslate}
                >

                    <Languages size={18} />

                    Translate

                </button>


                {/* RESULT */}

                {translatedText && (

                    <div className="translate-result">

                        <div className="translate-result-header">

                            <span>
                                Translation
                            </span>

                            <button
                                type="button"
                                onClick={handleCopy}
                                title="Copy translation"
                            >

                                <Copy size={16} />

                            </button>

                        </div>

                        <div className="translate-result-text">

                            {translatedText}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default TranslatePanel;