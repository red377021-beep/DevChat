import "./SettingsHeader.css";

import {
    Settings,
    Search,
    ArrowLeft,
} from "lucide-react";


function SettingsHeader({
    title = "Settings",
    subtitle = "Manage your DevChat experience",
    onBack,
    onSearch,
}) {

    return (
        <header className="settings-header">

            <div className="settings-header__left">

                {onBack && (
                    <button
                        type="button"
                        className="settings-header__back"
                        onClick={onBack}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}


                <div className="settings-header__icon">
                    <Settings size={19} />
                </div>


                <div className="settings-header__text">

                    <h1>
                        {title}
                    </h1>

                    <span>
                        {subtitle}
                    </span>

                </div>

            </div>


            <button
                type="button"
                className="settings-header__search"
                onClick={onSearch}
                aria-label="Search settings"
            >
                <Search size={18} />
            </button>

        </header>
    );
}


export default SettingsHeader;