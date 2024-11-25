const dotenv = require('dotenv');
const getDatabase = require("../config");
const bcrypt = require("bcrypt");
const UserGroupsController = require("./userGroupsController");
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
     * Create a new manual user with an email, password, username, and creation method.
     * @param email - The email of the new user.
     * @param password - The password of the new user.
     * @param username - The username of the new user.
     * @param creationUserMethodID - The method used to create the user.
     * @returns {Promise<*>} - A promise that resolves to the user object.
     */
    static async createManualUser(email, password, username , creationUserMethodID){
        const { models } = await getDatabase();

        const hashedPassword = await bcrypt.hash(password, 10);

        const db_user = await models.users.create({
            username, password: hashedPassword, email, creationusermethod : creationUserMethodID
        });

        if (!db_user){
            throw new Error('Cannot create a user');
        }

        await UserGroupsController.addUserToDefaultGroup(db_user.id);

        if(!(await bcrypt.compare(password, db_user.password))) {
            throw new Error('Invalid credentials were provided, preventing the connection');
        }

        return db_user;
    }

    /**
     * Retrieve a user by their email and password
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @param creationUserMethodID - The method used to create the user.
     * @returns {Promise<Model|null>} - A promise that resolves to the user object or null if not found.
     */
    static async findManualUser(email, password, creationUserMethodID){
        const { models } = await getDatabase();
        const db_user = await models.users.findOne({where: {email, creationusermethod : creationUserMethodID}});
        if (!db_user){
            throw new Error('Invalid credentials were provided, preventing the connection');
        }
        if(!(await bcrypt.compare(password, db_user.password))) {
            throw new Error('Invalid credentials were provided, preventing the connection');
        }
        return db_user;
    }

    /**
     * Create a new VCS user with a username, email, and creation method.
     * @param {string} username - The username of the new user.
     * @param {string} email - The email of the new user.
     * @param {string} creationUserMethodID - The method used to create the user.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the user object and a boolean indicating if it was created.
     * @throws {Error} - Throws an error if the user cannot be created.
     */
    static async findOrCreateVCSUser(username, email, creationUserMethodID){
        const { models } = await getDatabase();

        const [db_user, created] = await models.users.findOrCreate({
            where: { email, creationusermethod : creationUserMethodID },
            defaults: {
                username,
                password: '',
                email,
                creationusermethod : creationUserMethodID
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