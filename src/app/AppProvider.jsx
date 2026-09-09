import { useReducer } from "react";

import AppContext from "./AppContext";
import appReducer, { initialState } from "./appReducer";

function AppProvider({ children }) {

    const [state, dispatch] = useReducer(

        appReducer,

        initialState

    );

    return (

        <AppContext.Provider

            value={{

                state,

                dispatch

            }}

        >

            {children}

        </AppContext.Provider>

    );

}

export default AppProvider;