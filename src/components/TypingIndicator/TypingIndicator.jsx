import "./TypingIndicator.css";

function TypingIndicator({

    name = "Kinza"

}) {

    return (

        <div className="typing-indicator">

            <span className="typing-name">

                {name} is typing

            </span>

            <div className="typing-dots">

                <span></span>

                <span></span>

                <span></span>

            </div>

        </div>

    );

}

export default TypingIndicator;