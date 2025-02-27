const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require('../../config/supabase');

const nodemailer = require("nodemailer");

//  Registrar usuario
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const { data: existingUser, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.json({ success: false, message: "User already exists with the same email!" });
        }

        // Encriptar contraseña
        const hashPassword = await bcrypt.hash(password, 12);

        // Insertar usuario en Supabase
        const { data, error: insertError } = await supabase
            .from("users")
            .insert([{ userName, email, password: hashPassword }])
            .select()
            .single();

        if (insertError) throw insertError;

        res.status(200).json({ success: true, message: "Registration successful" });

    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Some error occurred" });
    }
};

//  Iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario en Supabase
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist. Please create an account :)" });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password :(" });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user.id, // Supabase usa `id` en lugar de `_id`
                role: user.role,
                email: user.email,
                userName: user.userName,
            },
            "CLIENT_SECRET_KEY",
            { expiresIn: "60m" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            success: true,
            message: "Login successfully",
            user: {
                email: user.email,
                role: user.role,
                id: user.id,
                userName: user.userName,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Some error occurred" });
    }
};

//  Cerrar sesión
const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully",
    });
};

//  Middleware de autenticación
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized user >:(" });
    }

    try {
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized user >:(" });
    }
};

//  Recuperar contraseña
const recoverPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar usuario en Supabase
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.json({ success: false, message: "No user found with this email address" });
        }

        // Configurar el transporter de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "yael69242@gmail.com", // Tu correo
                pass: "erzw isln wtgc qqbk", // Contraseña de aplicación de Gmail
            },
        });

        // Generar un token para restablecer contraseña
        const TOKEN = jwt.sign({ id: user.id }, "jwt_secret_key", { expiresIn: "1d" });

        // Configurar el correo a enviar
        const mailOptions = {
            from: "yael69242@gmail.com",
            to: email,
            subject: "Recuperación de Contraseña",
            text: `Hola ${user.userName}, tu contraseña es: ${user.password}`,
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, message: "Error al enviar el correo" });
            }

            res.status(200).json({ success: true, message: "Se ha enviado un correo con la contraseña" });
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Ha ocurrido un error" });
    }
};

// Exportar funciones
module.exports = { registerUser, loginUser, logoutUser, authMiddleware, recoverPassword };


//