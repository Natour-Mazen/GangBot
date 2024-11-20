const getDatabase = require("../config");

class OrganizationProjectsController {

    /**
     * Retrieve all projects for an organization.
     * @param {number} organizationId - The ID of the organization.
     * @returns {Promise<Array>} - A promise that resolves to an array of project objects.
     */
    static async getProjectsByOrganizationId(organizationId) {
        const { models } = await getDatabase();
        return await models.project.findAll({
            where: {
                organizationId
            }
        });
    }

    /**
     * Add a project to an organization.
     * @param {number} organizationId - The ID of the organization.
     * @param {number} projectId - The ID of the project.
     * @returns {Promise<Object>} - A promise that resolves to the organization project object.
     * @throws {Error} - Throws an error if the project cannot be added to the organization.
     */
    static async addProjectToOrganization(organizationId, projectId) {
       const { models } = await getDatabase();
         const [organizationProject, created] = await models.organizationprojects.findOrCreate({
              where: { organizationId, projectId },
              defaults: { organizationId, projectId }
         });
        if (!organizationProject){
            throw new Error('Cannot add project to organization');
        }
        return organizationProject;
    }

    /**
     * Remove a project from an organization.
     * @param {number} organizationId - The ID of the organization.
     * @param {number} projectId - The ID of the project.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async removeProjectFromOrganization(organizationId, projectId) {
        const { models } = await getDatabase();
        return await models.organizationprojects.destroy({where: {organizationId, projectId}});
    }

    /**
     * Retrieve all organizations associated with a project.
     * @param {number} projectId - The ID of the project.
     * @returns {Promise<Array>} - A promise that resolves to an array of organization project objects.
     */
    static async getOrganizationsByProjectId(projectId) {
        const { models } = await getDatabase();
        return await models.organizationprojects.findAll({where: {projectId}});
    }
}

module.exports = OrganizationProjectsController;