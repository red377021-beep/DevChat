import { useState } from "react";

export default function useMessageEditor() {

    const [editing, setEditing] = useState(false);

    const [value, setValue] = useState("");

    function startEdit(text) {

        setEditing(true);

        setValue(text);

    }

    function cancelEdit() {

        setEditing(false);

        setValue("");

    }

    return {

        editing,

        value,

        setValue,

        startEdit,

        cancelEdit

    };

}