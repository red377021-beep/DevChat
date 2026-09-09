import { useContext } from "react";

import AppContext from "./AppContext";

function useApp() {

    return useContext(AppContext);

}

export default useApp;