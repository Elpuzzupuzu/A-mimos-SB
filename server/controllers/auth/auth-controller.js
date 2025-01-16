const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')


//register}

const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // Aquí puedes agregar la lógica del registro
        const hashPassword = await bcrypt.hash(password , 12);
        const newUser = new User({
            userName,
             email, 
             password : hashPassword,
        })

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successfull",
        });



    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};





//login

const login = async(req, res)=>{
    try {
        // Aquí puedes agregar la lógica del registro
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }


}











//logout



//auth middleware




module.exports = {registerUser};