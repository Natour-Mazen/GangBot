const dotenv = require('dotenv');
const getDatabase = require("../config");
const bcrypt = require("bcrypt");
dotenv.config();

class UserController {
    static async getUserByGitHubName(github_username) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {githubusername: github_username}});
    }

    static async getUserById(id) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {id: id}});
    }

    static async createUser(username, password, email){
        const { models } = await getDatabase();

        const hashedPassword = await bcrypt.hash(password, 10);

        const [db_user, created] = await models.users.findOrCreate({
            where: { username },
            defaults: { username, password: hashedPassword, email }
        });

        if (!db_user){
            throw new Error('Cannot create username');
        }

        if(!(await bcrypt.compare(password, db_user.password))) {
            throw new Error('Invalid username or password');
        }

        return db_user;
    }

    static async getUser(username){
        const { models } = await getDatabase();
        return await models.users.findOne({
            where: {
                username
            }
        })
    }
}

module.exports = UserController;