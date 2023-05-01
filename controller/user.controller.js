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

exports.recognizeDB = async (req, res, next) => {
   try {
      const { email } = req.body; //the name of user
      const pythonScript = 'voice_auth.py'
      const input = ' -t enroll -n "' + `${email}` + '" -f my_unique_voice.wav'
      const command = `python ${pythonScript} ${input}`

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

      console.log(" function done successfuly")
      res.json({ status: true, success: "Recognition recognition have made successfuly" })
   } catch (error) {
      throw error
   }
}

exports.recognize = async (req, res, next) => {
   try {
      const environmentName = 'base'
      const pythonScript = 'voice_auth.py'
      const input = ' -t recognize -f my_unique_voice_check.wav'
      const command_env = `conda activate ${environmentName}`

      const pythonProc1 = spawn(command_env, { shell: true });

      pythonProc1.stdout.on('data', (data) => {
         console.log(`stdout: ${data}`);
      });

      pythonProc1.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc1.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
      });

      const command = `python ${pythonScript} ${input}`

      const pythonProc2 = spawn(command, { shell: true });
      pythonProc2.stdout.on('data', (data) => {
         console.log(`stdout: ${data}`);
      });

      pythonProc2.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc2.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
      });


      console.log("Recognize function done successfuly")
      res.json({ status: true, success: "Mel Spectrogarm created successfuly" })

   } catch (error) {
      throw error
   }
}

exports.emotion = async (req, res, next) => {
   try {
      const environmentName = 'base'
      const pythonScript = 'predict.py'
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

      console.log("Emotion recognition have made successfuly")
      res.json({ status: true, success: "Emotion recognition have made successfuly" })
   } catch (error) {
      throw error
   }
}
