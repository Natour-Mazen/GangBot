const getDatabase = require("../config");


class UserTokensController {

    /**
     * Retrieve all user tokens for a specific user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} - A promise that resolves to an array of user tokens.
     */
    static async getUserTokensByUserId(userId) {
        const { models } = await getDatabase();
        return await models.usertokens.findAll({where: {userid: userId}});
    }

    /**
     * Retrieve a user token by user ID and provider method ID.
     * @param {number} userId - The ID of the user.
     * @param {number} providerMethodId - The ID of the provider method.
     * @returns {Promise<Object|null>} - A promise that resolves to the user token or null if not found.
     */
    static async getUserTokenByUserIdAndProviderMethod(userId, providerMethodId) {
        const { models } = await getDatabase();
        return await models.usertokens.findOne({where: {userid: userId, authenticationmethod: providerMethodId}});
    }

    /**
     * Create a new user token or find an existing one.
     * @param {number} userId - The ID of the user.
     * @param {number} providerMethodId - The ID of the provider method.
     * @param {string} newJwtToken - The new JWT token to be associated with the user.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the user token and a boolean indicating if it was created.
     * @throws {Error} - Throws an error if the user token cannot be created.
     */
    static async findOrCreateUserToken(userId, providerMethodId, newJwtToken) {
        const { models } = await getDatabase();
        const [userToken, tokenCreated] = await models.usertokens.findOrCreate({
            where: {
                userid: userId,
                authenticationmethod: providerMethodId
            },
            defaults: {
                userid: userId,
                authenticationmethod: providerMethodId,
                jwttoken: newJwtToken
            }
        });

        if (!userToken){
            throw new Error('Cannot create user token');
        }

        return [userToken, tokenCreated];
    }

    /**
     * Update an existing user token with a new JWT token.
     * @param {Object} userToken - The user token object to be updated.
     * @param {string} newJwtToken - The new JWT token to be associated with the user token.
     * @returns {Promise<Object>} - A promise that resolves to the updated user token.
     */
    static async updateUserToken(userToken, newJwtToken) {
        return await userToken.update({jwttoken: newJwtToken});
    }

    /**
     * Delete a user token by user ID and provider method.
     * @param {number} userId - The ID of the user.
     * @param {number} providerMethodId - The provider method object ID .
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async deleteUserToken(userId, providerMethodId) {
        const { models } = await getDatabase();
        return await models.usertokens.destroy({where: {userid: userId, authenticationmethod: providerMethodId}});
    }
}

module.exports = UserTokensController;