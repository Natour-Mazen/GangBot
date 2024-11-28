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
     * @param {string} organizationName - The name of the organization.
     * @param {string} organizationDescription - The description of the organization.
     * @param {number} creatorID - The ID of the user who created the organization.
     * @returns {Promise<Object>} - A promise that resolves to the organization object.
     * @throws {Error} - Throws an error if the organization cannot be created.
     */
    static async findOrCreateOrganization(organizationName, organizationDescription, creatorID) {
        const {models} = await getDatabase();

        const [organization, created] = await models.organization.findOrCreate({
            where: {organizationname : organizationName, creatorid : creatorID},
            defaults: {
                organizationname : organizationName,
                organizationdescription : organizationDescription,
                creationdate : new Date(),
                creatorid : creatorID
            }
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


     /**
      * Retrieve all organizations by creator ID.
      * @param {number} creatorId - The ID of the creator.
      * @param limit - The maximum number of organizations to retrieve.
      * @param offset - The number of organizations to skip
      * @returns {Promise<Array>} - A promise that resolves to an array of organization objects.
      */
    static async getAllOrganizationByCreatorId(creatorId, limit, offset) {
        const {models} = await getDatabase();
        return await models.organization.findAll({
            where: {
                creatorid: creatorId
            },
            limit,
            offset
        });
    }

    /**
     * Count organizations by creator ID.
     * @param {number} creatorId - The ID of the creator.
     * @returns {Promise<number>} - A promise that resolves to the number of organizations
     */
    static async  countOrganizationByCreatorId(creatorId) {
        const {models} = await getDatabase();
        return await models.organization.count({
            where: {
                creatorid: creatorId
            }
        })
    }

    /**
     * Update an organization by its ID.
     * @param id - The ID of the organization.
     * @param organizationName - The name of the organization.
     * @param organizationDescription - The description of the organization.
     * @returns {Promise<*>} - A promise that resolves to the number of rows updated.
     */
    static async updateOrganizationById(id, organizationName, organizationDescription) {
        const {models} = await getDatabase();
        return await models.organization.update({
            organizationname: organizationName,
            organizationdescription: organizationDescription
        }, {
            where: {
                id
            }
        });
    }



}

module.exports = OrganizationController;