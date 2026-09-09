import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/db.js";


// =====================================================
// SIGNUP
// =====================================================

export const signup = async (req, res) => {

    try {

        const {
            username: usernameInput,
            email: emailInput,
            password,
            full_name: fullNameInput,
        } = req.body;


        // =================================================
        // NORMALIZE DATA
        // =================================================

        const username = usernameInput?.trim();
        const email = emailInput?.trim().toLowerCase();
        const full_name = fullNameInput?.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (!username || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Username, email and password are required",
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });

        }


        // =================================================
        // CHECK EXISTING USERNAME
        // =================================================

        const {
            data: usernameUser,
            error: usernameError,
        } = await supabase
            .from("users")
            .select("id, username")
            .eq("username", username)
            .maybeSingle();


        if (usernameError) {

            console.error(
                "Username check error:",
                usernameError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check username",
            });

        }


        if (usernameUser) {

            return res.status(409).json({
                success: false,
                message:
                    "Username already exists",
            });

        }


        // =================================================
        // CHECK EXISTING EMAIL
        // =================================================

        const {
            data: emailUser,
            error: emailError,
        } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", email)
            .maybeSingle();


        if (emailError) {

            console.error(
                "Email check error:",
                emailError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check email",
            });

        }


        if (emailUser) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already exists",
            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // =================================================
        // CREATE USER
        // =================================================

        const {
            data: user,
            error: createUserError,
        } = await supabase
            .from("users")
            .insert([
                {
                    username,
                    email,
                    password: hashedPassword,

                    full_name:
                        full_name || username,

                    bio: "",

                    avatar_url: "",

                    status:
                        "Hey there! I am using DevChat.",

                    is_online: false,
                },
            ])
            .select(
                `
                id,
                username,
                email,
                full_name,
                bio,
                avatar_url,
                status,
                is_online,
                created_at
                `
            )
            .single();


        if (createUserError) {

            console.error(
                "Create user error:",
                createUserError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create account",
            });

        }


        // =================================================
        // CREATE JWT
        // =================================================

        const token = jwt.sign(

            {
                userId: user.id,
                username: user.username,
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d",
            }

        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

            token,

            user,

        });

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Signup failed",
        });

    }

};



// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {

    try {

        const {
            email: emailInput,
            password,
        } = req.body;


        // =================================================
        // NORMALIZE EMAIL
        // =================================================

        const email =
            emailInput?.trim().toLowerCase();


        // =================================================
        // VALIDATION
        // =================================================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });

        }


        // =================================================
        // FIND USER
        // =================================================

        const {
            data: user,
            error: userError,
        } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();


        if (userError) {

            console.error(
                "Login user error:",
                userError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to find user",
            });

        }


        // =================================================
        // USER NOT FOUND
        // =================================================

        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });

        }


        // =================================================
        // CHECK PASSWORD
        // =================================================

        if (!user.password) {

            console.error(
                "User password is missing:",
                user.id
            );

            return res.status(500).json({
                success: false,
                message:
                    "User account password is missing",
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });

        }


        // =================================================
        // UPDATE ONLINE STATUS
        // =================================================

        const {
            error: onlineStatusError,
        } = await supabase
            .from("users")
            .update({
                is_online: true,
                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", user.id);


        if (onlineStatusError) {

            console.error(
                "Online status update error:",
                onlineStatusError
            );

        }


        // =================================================
        // CREATE JWT
        // =================================================

        const token = jwt.sign(

            {
                userId: user.id,
                username: user.username,
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d",
            }

        );


        // =================================================
        // REMOVE PASSWORD
        // =================================================

        const {
            password: _password,
            ...safeUser
        } = user;


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: safeUser,

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Login failed",
        });

    }

};