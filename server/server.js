const express = require ('express');
const mongoose = require ('mongoose');
const cookieParser = require ('cookie-parser');
const cors = require ('cors');
const authRouter = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes')
const shopProductsRouter = require ('./routes/shop/products-routes')
const shopCartRouter = require ('./routes/shop/cart-routes')


mongoose.connect('mongodb+srv://yaelop117:f7q2YBjbwchcvhMD@cluster0.2pgv9.mongodb.net/').then(()=>console.log('MongoDB Connected')).catch(error =>console.log('error al conectar a la base de datos'))


const app = express()
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin : "http://localhost:5173",
        methods : ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders :[
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials : true
    })
)

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRouter)
app.use("/api/admin/products",adminProductsRouter)
app.use("/api/shop/products", shopProductsRouter)
app.use("/api/shop/cart", shopCartRouter)




app.listen(PORT, ()=> console.log(`server is now running on port ${PORT}`))