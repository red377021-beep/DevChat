import "./AISuggestions.css";

import {
    Code2,
    Lightbulb,
    PenLine,
    GraduationCap,
} from "lucide-react";


function AISuggestions({
    suggestions = [],
    onSelect,
}) {

    const defaultSuggestions = [
        {
            id: "code",
            title: "Help me code",
            description: "Build or fix code",
            icon: Code2,
        },
        {
            id: "ideas",
            title: "Give me ideas",
            description: "Brainstorm something",
            icon: Lightbulb,
        },
        {
            id: "write",
            title: "Help me write",
            description: "Create better content",
            icon: PenLine,
        },
        {
            id: "learn",
            title: "Teach me",
            description: "Explain something simply",
            icon: GraduationCap,
        },
    ];


    const items =
        suggestions.length > 0
            ? suggestions
            : defaultSuggestions;


    return (
        <div className="ai-suggestions">

            <div className="ai-suggestions__title">
                <span>Try asking</span>
            </div>


            <div className="ai-suggestions__grid">

                {items.map((item) => {

                    const Icon = item.icon || Lightbulb;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className="ai-suggestions__card"
                            onClick={() => onSelect?.(item)}
                        >

                            <div className="ai-suggestions__icon">
                                <Icon size={17} />
                            </div>

                            <div className="ai-suggestions__content">

                                <strong>
                                    {item.title}
                                </strong>

                                <span>
                                    {item.description}
                                </span>

                            </div>

                        </button>
                    );

                })}

            </div>

        </div>
    );
}


export default AISuggestions;