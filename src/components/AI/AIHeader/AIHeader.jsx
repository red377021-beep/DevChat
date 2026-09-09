import "./AIHeader.css";

import {
    Bot,
    Sparkles,
    Search,
    MoreVertical,
} from "lucide-react";


function AIHeader({
    title = "DevChat AI",
    subtitle = "Your intelligent assistant",
    onSearch,
    onMore,
}) {

    return (
        <header className="ai-header">

            {/* LEFT */}
            <div className="ai-header__left">

                <div className="ai-header__icon">
                    <Bot size={22} />
                    <span className="ai-header__spark">
                        <Sparkles size={10} />
                    </span>
                </div>

                <div className="ai-header__content">
                    <h1>{title}</h1>

                    <div className="ai-header__status">
                        <span className="ai-header__online" />
                        <span>{subtitle}</span>
                    </div>
                </div>

            </div>


            {/* ACTIONS */}
            <div className="ai-header__actions">

                <button
                    type="button"
                    className="ai-header__button"
                    onClick={onSearch}
                    aria-label="Search AI conversations"
                >
                    <Search size={19} />
                </button>


                <button
                    type="button"
                    className="ai-header__button"
                    onClick={onMore}
                    aria-label="More options"
                >
                    <MoreVertical size={19} />
                </button>

            </div>

        </header>
    );
}


export default AIHeader;