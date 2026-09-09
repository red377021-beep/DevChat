import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    MessageCircle,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            // =================================================
            // REAL BACKEND LOGIN
            // =================================================

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                    }),
                }
            );


            const data = await response.json();


            // =================================================
            // LOGIN FAILED
            // =================================================

            if (!response.ok || !data.success) {

                setError(
                    data.message ||
                    "Invalid email or password."
                );

                setLoading(false);

                return;
            }


            // =================================================
            // SAVE REAL AUTH SESSION
            // =================================================

            login(
                data.token,
                data.user
            );


            // =================================================
            // GO TO DEVCHAT
            // =================================================

            navigate("/", {
                replace: true,
            });


        } catch (error) {

            console.error(
                "Login request failed:",
                error
            );

            setError(
                "Unable to connect to DevChat server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    <MessageCircle size={34} />
                </div>


                <h1>
                    Welcome Back
                </h1>


                <p className="auth-subtitle">
                    Login to your DevChat account
                </p>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    <div className="auth-input-group">

                        <label>
                            Email
                        </label>


                        <div className="auth-input-wrapper">

                            <Mail size={19} />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>


                    <div className="auth-input-group">

                        <label>
                            Password
                        </label>


                        <div className="auth-input-wrapper">

                            <Lock size={19} />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />


                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    <div className="auth-forgot">

                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    "Forgot Password will be added later."
                                )
                            }
                        >
                            Forgot password?
                        </button>

                    </div>


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>

                                <LoaderCircle
                                    size={20}
                                    className="auth-spinner"
                                />

                                Logging in...

                            </>

                        ) : (

                            "Login"

                        )}

                    </button>

                </form>


                <div className="auth-switch">

                    Don't have an account?

                    <Link to="/signup">
                        Create account
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Login;