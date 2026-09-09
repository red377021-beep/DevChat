// ======================================================
// DEVCHAT AUTH CONTEXT
// ======================================================

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


const AuthContext = createContext(null);


const TOKEN_KEY = "devchat_token";
const USER_KEY = "devchat_user";


// ======================================================
// PROVIDER
// ======================================================

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);


    // ==================================================
    // RESTORE LOGIN SESSION
    // ==================================================

    useEffect(() => {

        const restoreSession = async () => {

            try {

                const savedToken =
                    localStorage.getItem(
                        TOKEN_KEY
                    );

                const savedUser =
                    localStorage.getItem(
                        USER_KEY
                    );


                // ==========================================
                // NO SESSION
                // ==========================================

                if (!savedToken) {

                    setToken(null);
                    setUser(null);

                    return;

                }


                // ==========================================
                // TEMP / INVALID SESSION
                // ==========================================

                if (
                    savedToken ===
                    "temporary-test-token"
                ) {

                    localStorage.removeItem(
                        TOKEN_KEY
                    );

                    localStorage.removeItem(
                        USER_KEY
                    );

                    setToken(null);
                    setUser(null);

                    return;

                }


                // ==========================================
                // RESTORE TOKEN
                // ==========================================

                setToken(savedToken);


                // ==========================================
                // RESTORE CACHED USER
                // ==========================================

                if (savedUser) {

                    try {

                        const parsedUser =
                            JSON.parse(
                                savedUser
                            );

                        setUser(parsedUser);

                    } catch (error) {

                        console.error(
                            "Failed to parse stored user:",
                            error
                        );

                        localStorage.removeItem(
                            USER_KEY
                        );

                    }

                }


                // ==========================================
                // FETCH REAL USER
                // ==========================================

                const response =
                    await fetch(
                        "http://localhost:5000/api/users/me",
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${savedToken}`,
                            },
                        }
                    );


                const data =
                    await response.json();


                // ==========================================
                // SESSION INVALID
                // ==========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    localStorage.removeItem(
                        TOKEN_KEY
                    );

                    localStorage.removeItem(
                        USER_KEY
                    );

                    setToken(null);
                    setUser(null);

                    return;

                }


                // ==========================================
                // SAVE FRESH USER
                // ==========================================

                localStorage.setItem(
                    USER_KEY,
                    JSON.stringify(
                        data.user
                    )
                );


                setUser(
                    data.user
                );


            } catch (error) {

                console.error(
                    "Auth session restore failed:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        restoreSession();

    }, []);


    // ==================================================
    // LOGIN
    // ==================================================

    const login = (
        newToken,
        newUser
    ) => {

        localStorage.setItem(
            TOKEN_KEY,
            newToken
        );


        localStorage.setItem(
            USER_KEY,
            JSON.stringify(newUser)
        );


        setToken(newToken);

        setUser(newUser);

    };


    // ==================================================
    // LOGOUT
    // ==================================================

    const logout = () => {

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            USER_KEY
        );


        setToken(null);

        setUser(null);

    };


    // ==================================================
    // UPDATE USER
    // ==================================================

    const updateUser = (
        newUser
    ) => {

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(newUser)
        );


        setUser(newUser);

    };


    // ==================================================
    // AUTH STATUS
    // ==================================================

    const isAuthenticated =
        Boolean(
            token &&
            user
        );


    // ==================================================
    // CONTEXT VALUE
    // ==================================================

    const value = {

        user,

        token,

        loading,

        isAuthenticated,

        login,

        logout,

        updateUser,

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );

}


// ======================================================
// HOOK
// ======================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}