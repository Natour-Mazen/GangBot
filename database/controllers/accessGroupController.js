
const getDatabase = require("../config");

class AccessGroupController {

    /**
     * Retrieve all access groups.
     * @returns {Promise<Array>} - A promise that resolves to an array of access group objects.
     */
    static async getAllGroups() {
        const { models } = await getDatabase();
        return await models.accessgroup.findAll();
    }

    /**
     * Retrieve an access group by its name.
     * @param {string} groupName - The name of the access group.
     * @returns {Promise<Object|null>} - A promise that resolves to the access group object or null if not found.
     */
    static async getGroupByName(groupName) {
        const { models } = await getDatabase();
        return await models.accessgroup.findOne({where: {groupname: groupName}});
    }

    /**
     * Create a new access group or find an existing one.
     * @param {string} groupName - The name of the access group.
     * @returns {Promise<Object>} - A promise that resolves to the access group object.
     * @throws {Error} - Throws an error if the access group cannot be created.
     */
    static async createGroup(groupName) {
        const { models } = await getDatabase();

        const [group, created] = await models.accessgroup.findOrCreate({
            where: { groupname: groupName },
            defaults: { groupname: groupName }
        });

        if (!group){
            throw new Error('Cannot create group');
        }

        return group;
    }

    /**
     * Delete an access group by its name.
     * @param {string} groupName - The name of the access group.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async deleteGroupByName(groupName) {
        const { models } = await getDatabase();
        return await models.accessgroup.destroy({where: {groupname: groupName}});
    }

    /**
     * Retrieve an access group by its ID.
     * @param {number} groupId - The ID of the access group.
     * @returns {Promise<Object|null>} - A promise that resolves to the access group object or null if not found.
     */
    static async getGroupById(groupId) {
        const { models } = await getDatabase();
        return await models.accessgroup.findOne({where: {id: groupId}});
    }

}

module.exports = AccessGroupController;