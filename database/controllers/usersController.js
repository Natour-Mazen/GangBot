const dotenv = require('dotenv');
const getDatabase = require("../config");
const bcrypt = require("bcrypt");
dotenv.config();

class UsersController {

    /**
     * Retrieve a user by their ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
     */
    static async getUserById(id) {
        const { models } = await getDatabase();
        return await models.users.findOne({where: {id: id}});
    }

    /**
     * Create a new user with a username, password, and email.
     * @param {string} username - The username of the new user.
     * @param {string} password - The password of the new user.
     * @param {string} email - The email of the new user.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the user object and a boolean indicating if it was created.
     * @throws {Error} - Throws an error if the user cannot be created or if the password is invalid.
     */
    static async createManualUser(username, password, email){
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

        return [db_user, created];
    }

    /**
     * Create a new VCS user with a username, email, and creation method.
     * @param {string} username - The username of the new user.
     * @param {string} email - The email of the new user.
     * @param {string} creationusermethod - The method used to create the user.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the user object and a boolean indicating if it was created.
     * @throws {Error} - Throws an error if the user cannot be created.
     */
    static async createVCSUser(username, email, creationusermethod){
        const { models } = await getDatabase();

        const [db_user, created] = await models.users.findOrCreate({
            where: { username },
            defaults: {
                username,
                password: '',
                email,
                creationusermethod
            }
        });

        if (!db_user){
            throw new Error('Cannot create VCS user');
        }

        return [db_user, created];
    }

    /**
     * Retrieve a user by their username.
     * @param {string} username - The username of the user.
     * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
     */
    static async getUser(username){
        const { models } = await getDatabase();
        return await models.users.findOne({
            where: {
                username
            }
        })
    }
}

module.exports = UsersController;