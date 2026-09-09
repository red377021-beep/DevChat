import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    MessageCircle,
    UserRound,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Signup.css";


function Signup() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [form, setForm] = useState({
        username: "",
        full_name: "",
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


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !form.username ||
            !form.full_name ||
            !form.email ||
            !form.password
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // REAL BACKEND SIGNUP
            // =================================================

            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(form),
                }
            );


            const data = await response.json();


            // =================================================
            // SIGNUP FAILED
            // =================================================

            if (!response.ok || !data.success) {

                setError(
                    data.message ||
                    "Signup failed."
                );

                return;
            }


            // =================================================
            // SAVE AUTH SESSION
            // =================================================

            login(
                data.token,
                data.user
            );


            // =================================================
            // GO DIRECTLY TO HOME
            // =================================================

            navigate("/", {
                replace: true,
            });


        } catch (error) {

            console.error(
                "Signup request failed:",
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
                    Create Account
                </h1>


                <p className="auth-subtitle">
                    Join DevChat and start chatting
                </p>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    <div className="auth-input-group">

                        <label>
                            Username
                        </label>


                        <div className="auth-input-wrapper">

                            <UserRound size={19} />

                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />

                        </div>

                    </div>


                    <div className="auth-input-group">

                        <label>
                            Full Name
                        </label>


                        <div className="auth-input-wrapper">

                            <UserRound size={19} />

                            <input
                                type="text"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={form.full_name}
                                onChange={handleChange}
                                autoComplete="name"
                            />

                        </div>

                    </div>


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
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
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

                                Creating account...

                            </>

                        ) : (

                            "Create Account"

                        )}

                    </button>

                </form>


                <div className="auth-switch">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Signup;