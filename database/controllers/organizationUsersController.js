const getDatabase = require("../config");

class OrganizationUsersController {

    /**
     * Retrieve all organization users.
     * @returns {Promise<Array>} - A promise that resolves to an array of organization user objects.
     */
    static async getAllOrganizationUsers() {
        const { models } = await getDatabase();
        return await models.organizationusers.findAll();
    }

    /**
     * Retrieve all users associated with an organization.
     * @param {number} organizationId - The ID of the organization.
     * @returns {Promise<Array>} - A promise that resolves to an array of organization user objects.
     */
    static async getUsersByOrganizationId(organizationId) {
        const {models} = await getDatabase();
        return await models.organizationusers.findAll({
            where: {
                organizationId
            }
        });
    }

    /**
     * Retrieve all organizations associated with a user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} - A promise that resolves to an array of organization user objects.
     */
    static async getOrganizationsByUserId(userId) {
        const {models} = await getDatabase();
        return await models.organizationusers.findAll({
            where: {
                userId
            }
        });
    }

    /**
     * Add a user to an organization.
     * @param {number} organizationId - The ID of the organization.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Object>} - A promise that resolves to the organization user object.
     * @throws {Error} - Throws an error if the user cannot be added to the organization.
     */
    static async addUserToOrganization(organizationId, userId) {
        const {models} = await getDatabase();
        const [organizationUser, created] = await models.organizationusers.findOrCreate({
            where: {organizationId, userId},
            defaults: {organizationId, userId}
        });
        if (!organizationUser) {
            throw new Error('Cannot add user to organization');
        }
        return organizationUser;
    }

    /**
     * Remove a user from an organization.
     * @param {number} organizationId - The ID of the organization.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async removeUserFromOrganization(organizationId, userId) {
        const {models} = await getDatabase();
        return await models.organizationusers.destroy({where: {organizationId, userId}});
    }

}

module.exports = OrganizationUsersController;