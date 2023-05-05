const UserService = require("../services/user.services")
const { spawn } = require('child_process');
const fs = require('fs');



exports.register = async (req, res, next) => {
   try {
      const { email, password } = req.body
      console.log(req.body)
      const successRes = await UserService.registerUser(email, password, 'audioFile');
      res.json({ status: true, success: "User registered successfuly" })
   } catch (error) {
      throw error
   }
}

exports.login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         res.status(200).json({ status: false, success: 'Parameter are not correct' })
         console.log('Parameter are not correct')
         return
      }
      const user = await UserService.checkUser(email);
      if (!user) {
         res.status(200).json({ status: false, success: 'User not exist' })
         console.log('User not exist')
         return
      }
      //
      const isMatch = 1;
      //
      if (isMatch == false) {
         res.status(200).json({ status: false, success: 'Password invalid' })
         console.log('Password invalid')
         return
      }

      let tokenData = { _id: user._id, email: user.email };
      const token = await UserService.genarateTokken(tokenData, "security", '1h')
      console.log("success login")
      res.status(200).json({ status: true, token: token, success: 'Success login' })
   } catch (error) {
      throw error
   }
}

exports.recognizeDB = async (req, res, next) => {
   try {
      const { email } = req.body; //the name of user
      console.log(email)
      const pythonScript = 'voice_auth.py'
      const input = ' -t enroll -n "' + `${email}` + '" -f my_unique_voice.wav'
      const command = `python ${pythonScript} ${input}`
      let retStatus = false;

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         if (data = "Succesfully enrolled the user") {
            retStatus = true;
         } else {
            retStatus = false;
         }
         console.log(`stdout: ${data} + ${retStatus}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(" function done successfuly")
         res.json({ status: retStatus })
         UserService.editUserAudioFile(email, 'my_unique_voice.wav')
         console.log(`child process exited with code ${code}`);
      });

   } catch (error) {
      throw error
   }
}

exports.recognize = async (req, res, next) => {
   try {
      const { email } = req.body; //the name of user
      const pythonScript = 'voice_auth.py'
      const input = ' -t recognize -f my_unique_voice_check.wav'
      const command = `python ${pythonScript} ${input}`
      let retStatus = false;

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         if (data = `Recognized:  ${email}`) {
            retStatus = true
         }
         console.log(`stdout: ${data}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
         console.log("Recognize function done successfuly")
         res.json({ status: retStatus })

      });


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
