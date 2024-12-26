const getDatabase = require("../config");


class providersAuthUsersTokensController {

    /**
     * Retrieve a provider user token by ID.
     * @param id - The ID of the user token.
     * @returns {Promise<Model|null>} - A promise that resolves to the user token or null if not found.
     */
    static async getProviderUserTokenByID(id) {
        const { models } = await getDatabase();
        return await models.providersauthuserstokens.findByPk(id);
    }

    /**
     * Create a new provider user token or find an existing one.
     * @param {number} providerMethodId - The ID of the provider method.
     * @param {string} newJwtToken - The new JWT token to be associated with the user.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the user token and a boolean indicating if it was created.
     * @throws {Error} - Throws an error if the user token cannot be created.
     */
    static async findOrCreateProviderUserToken(providerMethodId, newJwtToken) {
        const { models } = await getDatabase();
        const [userToken, tokenCreated] = await models.providersauthuserstokens.findOrCreate({
            where: {
                providermethod: providerMethodId,
                jwttoken: newJwtToken
            },
            defaults: {
                providermethod: providerMethodId,
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
    static async updateProviderUserToken(userToken, newJwtToken) {
        return await userToken.update({jwttoken: newJwtToken});
    }

    /**
     * Delete a user token by user ID and provider method.
     * @param {number} id - The ID of the user.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async deleteProviderUserToken(id) {
        const { models } = await getDatabase();
        return await models.providersauthuserstokens.destroy({where: {id: id}});
    }
}

module.exports = providersAuthUsersTokensController;