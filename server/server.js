require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const path = require("path"); // Ya no es necesario

// 🔹 Importar Supabase
const supabase = require("./config/supabase");

// 🔹 Importar rutas
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopSearchProduct = require("./routes/shop/search-routes")


const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middlewares
app.use(
  cors({
    // origin: ["https://a-mimos-sb.onrender.com", "http://localhost:5173"],
    origin: '*', // <--- CAMBIA A ESTO TEMPORALMENTE
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// 🔹 Usar rutas de API
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/search",shopSearchProduct)


// 🔹 Elimina las siguientes líneas para que el backend deje de servir el frontend:
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;