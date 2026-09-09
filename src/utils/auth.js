// ======================================================
// DEVCHAT AUTH UTILITY
// ======================================================

const TOKEN_KEY = "devchat_token";
const USER_KEY = "devchat_user";

// ======================================================
// TOKEN
// ======================================================

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// ======================================================
// USER
// ======================================================

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("Failed to parse stored user:", error);

        localStorage.removeItem(USER_KEY);

        return null;
    }
};

export const setUser = (user) => {
    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

// ======================================================
// AUTH STATE
// ======================================================

export const isAuthenticated = () => {
    const token = getToken();

    return Boolean(token);
};

// ======================================================
// LOGOUT
// ======================================================

export const logout = () => {
    removeToken();
    removeUser();
};

// ======================================================
// CLEAR ALL AUTH DATA
// ======================================================

export const clearAuth = () => {
    logout();
};