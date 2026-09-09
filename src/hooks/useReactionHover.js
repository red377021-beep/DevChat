import { useRef, useState } from "react";

function useReactionHover() {

    const timer = useRef(null);

    const [visible,setVisible]=useState(false);

    function show(){

        clearTimeout(timer.current);

        setVisible(true);

    }

    function hide(){

        timer.current=setTimeout(()=>{

            setVisible(false);

        },500);

    }

    function cancelHide(){

        clearTimeout(timer.current);

    }

    return{

        visible,

        show,

        hide,

        cancelHide

    };

}

export default useReactionHover;