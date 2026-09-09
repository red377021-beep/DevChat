import { useEffect, useState } from "react";

function useContextMenu() {

    const [menu, setMenu] = useState({

        visible: false,

        x: 0,

        y: 0,

        message: null

    });

    const openMenu = (event, message) => {

        event.preventDefault();

        setMenu({

            visible: true,

            x: event.clientX,

            y: event.clientY,

            message

        });

    };

    const closeMenu = () => {

        setMenu({

            visible: false,

            x: 0,

            y: 0,

            message: null

        });

    };

    useEffect(() => {

        window.addEventListener("click", closeMenu);

        return () => {

            window.removeEventListener("click", closeMenu);

        };

    }, []);

    return {

        menu,

        openMenu,

        closeMenu

    };

}

export default useContextMenu;