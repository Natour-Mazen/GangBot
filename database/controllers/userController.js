const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class UserController {
    static async getUserByGitHubName(github_username) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {githubusername: github_username}});
    }

    static async getUserByGitHubId(github_id) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {githubid: github_id}});
    }
}

module.exports = UserController;