const UserService = require("../services/user.services")

exports.register = async(req, res, next)=>{
    try{
        const {email, password} = req.body;
        const successRes = await UserService.registerUser(email, password);
        res.json({status:true, success:"User registered successfuly"})
     }catch(error){
        throw error
     }
}

exports.login = async(req, res, next)=>{
   try{
       const {email, password} = req.body;
       const user = await UserService.checkUser(email);

       if(!user){
         throw new Error('User not exist');
       }

       const isMatch = await user.comparePassword(password);
       if (isMatch==false) {
         throw new Error('Password invalid');
       }

       let tokenData= {_id:user._id, email:user.email};

       const token = await UserService.genarateTokkenl(tokenData, "security",'1h' )

      res.status(200).json({status:true, token: token})
    }catch(error){
       throw error
    }
}