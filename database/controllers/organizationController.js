const getDatabase = require("../config");

class OrganizationController {

    /**
     * Retrieve all organizations.
     * @returns {Promise<Array>} - A promise that resolves to an array of organization objects.
     */
    static async getAllOrganizations() {
        const { models } = await getDatabase();
        return await models.organization.findAll();
    }

    /**
     * Retrieve an organization by its ID.
     * @param {number} id - The id of the organization.
     * @returns {Promise<Object|null>} - A promise that resolves to the organization object or null if not found.
     */
    static async getOrganizationByID(id) {
        const {models} = await getDatabase();
        return await models.organization.findOne({
            where: {
                id
            }
        })
    }

    /**
     * Create a new organization or find an existing one.
     * @param {string} name - The name of the organization.
     * @returns {Promise<Object>} - A promise that resolves to the organization object.
     * @throws {Error} - Throws an error if the organization cannot be created.
     */
    static async createOrganization(name) {
        const {models} = await getDatabase();

        const [organization, created] = await models.organization.findOrCreate({
            where: {name},
            defaults: {name}
        });

        if (!organization) {
            throw new Error('Cannot create organization');
        }

        return organization;
    }

    /**
     * Delete an organization by its ID.
     * @param {number} id - The ID of the organization.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async deleteOrganizationById(id) {
        const {models} = await getDatabase();
        return await models.organization.destroy({where: {id}});
    }



}

module.exports = OrganizationController;