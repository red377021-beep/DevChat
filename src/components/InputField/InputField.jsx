import "./InputField.css";

function InputField({

    value,

    onChange,

    onKeyDown,

    placeholder

}) {

    function autoResize(e){

        e.target.style.height="24px";

        e.target.style.height=e.target.scrollHeight+"px";

    }

    return(

        <textarea

            className="chat-input"

            value={value}

            rows={1}

            placeholder={placeholder}

            onChange={(e)=>{

                onChange(e.target.value);

                autoResize(e);

            }}

            onKeyDown={onKeyDown}

        />

    );

}

export default InputField;