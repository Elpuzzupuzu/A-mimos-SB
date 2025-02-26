require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// 🔹 Importar Supabase desde el archivo separado
const supabase = require("./config/supabase");

// 🔹 Importar rutas
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes"); // Corrección de typo
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// 🔹 Usar rutas
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app; // Exportar la app si es necesario
