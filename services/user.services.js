const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const { search } = require('../app');

class UserService {
    static async registerUser(email, password, audioFile) {
        try {
            const createUser = new UserModel({ email, password, audioFile });
            return await createUser.save();
        } catch (error) {
            throw error;
        }
    }

    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async editUserAudioFile(email, audioFile) {
        try {
            console.log(email + " " + audioFile)
            const user = UserModel.findOne({ email })
            await user.updateOne({ $set: { audioFile } });
        } catch (error) {
            throw error;
        }
    }

    static async checkDoneLevels(email) {
        try {
            console.log(email)
            const user = UserModel.findOne({ email })
            if (user.email != "default") {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    static async genarateTokken(tokenData, security, jwt_expire) {
        return jwt.sign(tokenData, security, { expiresIn: jwt_expire })
    }
}

module.exports = UserService