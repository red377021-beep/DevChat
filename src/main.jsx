// ======================================================
// DEVCHAT MAIN ENTRY
// ======================================================

import React from "react";
import ReactDOM from "react-dom/client";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import "./styles/theme/theme.css";
import "./index.css";

import App from "./App";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LayoutProvider } from "./context/LayoutContext";
import { ChatProvider } from "./context/ChatContext";
import { CallProvider } from "./context/CallContext";


// ======================================================
// APP RENDER
// ======================================================

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <BrowserRouter>

            <AuthProvider>

                <ThemeProvider>

                    <LayoutProvider>

                        <ChatProvider>

                            <CallProvider>

                                <Routes>

                                    {/* ==========================
                                          LOGIN
                                    =========================== */}

                                    <Route
                                        path="/login"
                                        element={<Login />}
                                    />


                                    {/* ==========================
                                          SIGNUP
                                    =========================== */}

                                    <Route
                                        path="/signup"
                                        element={<Signup />}
                                    />


                                    {/* ==========================
                                          PROTECTED APP
                                    =========================== */}

                                    <Route
                                        path="/*"
                                        element={
                                            <ProtectedRoute>
                                                <App />
                                            </ProtectedRoute>
                                        }
                                    />

                                </Routes>

                            </CallProvider>

                        </ChatProvider>

                    </LayoutProvider>

                </ThemeProvider>

            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>
);