const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')


//register}

const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // Aquí puedes agregar la lógica del registro
        const checkUser = await User.findOne({email});
        if(checkUser)return res.json({success : false, message : 'User already exists with the same email! Please try to use another email '})




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

const loginUser = async(req, res)=>{
    const {email, password } = req.body;
    try {
        // Aquí puedes agregar la lógica del registro
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success : false,
            message : "User doesnt exists Please Create an Account :)",
        });

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if(!checkPasswordMatch) return res.json({
            success : false,
            message : "Incorrect password :("
        });

        const token = jwt.sign({
            id : checkUser._id, role : checkUser.role, email : checkUser.email
        }, 
        "CLIENT_SECRET_KEY",
         {expiresIn : '60m'}
        );

        res.cookie('token', token,{httpOnly: true, secure : false}).json({
            success : true,
            message: 'login successfully',
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id: checkUser._id
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }


}











//logout

const logoutUser = (req, res)=> {
    res.clearCookie('token').json({
        success : true,
        message : 'logged out successfully'
    })
}



//auth middleware
const authMiddleware = async(req,res,next)=> {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success : false,
        message :'Unauthorised user >:('
    })

    try{
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY') ;
        req.user=decoded;
        next()
    }catch(error){
        res.status(401).json({
            success : false,
            message : 'Unauthorized user >:('
        })
    }

}



module.exports = {registerUser, loginUser, logoutUser, authMiddleware};