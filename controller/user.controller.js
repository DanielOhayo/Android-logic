const UserService = require("../services/user.services")
const { spawn } = require('child_process');


exports.register = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      console.log(req.body)
      const successRes = await UserService.registerUser(email, password);
      res.json({ status: true, success: "User registered successfuly" })
   } catch (error) {
      throw error
   }
}

exports.login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         throw new Error('Parameter are not correct');
      }
      const user = await UserService.checkUser(email);
      if (!user) {
         throw new Error('User not exist');
      }
      //
      const isMatch = 1;
      //
      if (isMatch == false) {
         throw new Error('Password invalid');
      }

      let tokenData = { _id: user._id, email: user.email };

      const token = await UserService.genarateTokken(tokenData, "security", '1h')
      console.log("success login")
      res.status(200).json({ status: true, token: token })
   } catch (error) {
      throw error
   }
}

exports.createMel = async (req, res, next) => {
   try {
      const environmentName = 'base'
      const pythonScript = 'controller/script1.py'
      const command = `conda run -n ${environmentName} python ${pythonScript}`

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         console.log(`stdout: ${data}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
      });
      console.log("Mel Spectrogarm created successfuly")
      res.json({ status: true, success: "Mel Spectrogarm created successfuly" })
   } catch (error) {
      throw error
   }
}