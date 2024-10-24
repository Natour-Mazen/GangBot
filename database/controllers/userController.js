const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class UserController {
    static async getUser(github_username) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {githubusername: github_username}});
    }
}

module.exports = UserController;