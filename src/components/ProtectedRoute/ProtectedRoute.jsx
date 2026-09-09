// ======================================================
// DEVCHAT PROTECTED ROUTE
// ======================================================

import {
    Navigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {

    const location = useLocation();

    const {
        isAuthenticated,
        loading,
    } = useAuth();

    // ==================================================
    // WAIT FOR AUTH SESSION
    // ==================================================

    if (loading) {
        return null;
    }

    // ==================================================
    // NOT LOGGED IN
    // ==================================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    // ==================================================
    // LOGGED IN
    // ==================================================

    return children;
}

export default ProtectedRoute;