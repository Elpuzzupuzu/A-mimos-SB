const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        requerired : true,
        unique : true
    },
    email : {
        type : String,
        requerired : true,
        unique : true
    },
    password : {
        type : String,
        requerired : true,
       
    },
    role : {
        type : String,
        default : 'user',
        
    }
    
    
});

const User = mongoose.model('User',UserSchema);
module.exports = User;