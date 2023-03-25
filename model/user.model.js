const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

const db = require('../config/db')

const {Schema} = mongoose;

const userShcema = new Schema({  
    email:{
    type:String,
    lowercase: true,
    required: true,
    unique: true
},
password:{
    type:String,
    required: true
}
  
})

// userShcema.pre("save", async function (){
//     try {
//         var user = this;
//         const salt = await(bcrypt.genSalt(10));
//         const haspass = await bcrypt.hash(user.password, salt)
//         user.password = haspass;
//     }catch(error){
//         throw error
//     }
// });

userShcema.method.comparePassword = async function(userPassword){
    try{
        const isMatch = await compare(userPassword, this.password)
        return isMatch;
    }catch(error){
        throw error
    }
}
const UserModel = db.model('user', userShcema)

module.exports = UserModel;