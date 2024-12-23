
const getDatabase = require("../config");
const AccessGroupController = require("./accessGroupController");

class UserGroupsController {

    /**
     * Retrieve the names of all groups a user belongs to by their user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} - A promise that resolves to an array of group objects.
     * @throws {Error} - Throws an error if the groups cannot be retrieved.
     */
    static async getGroupsNamesByUserId(userId) {
        const { models } = await getDatabase();
        const group_ids =  await models.usergroups.findAll({where: {userid: userId}});
        let groups = [];
        for(const group_id of group_ids){
            const group = await AccessGroupController.getGroupById(group_id.groupid);
            groups.push(group);
        }
        return groups;
    }

    /**
     * Add a user to a group by their user ID and the group name.
     * @param {number} userId - The ID of the user.
     * @param {string} groupName - The name of the group.
     * @returns {Promise<Object>} - A promise that resolves to the user group object.
     * @throws {Error} - Throws an error if the group cannot be found or the user cannot be added to the group.
     */
    static async addUserToGroup(userId, groupName) {
        const { models } = await getDatabase();
        const group = await AccessGroupController.getGroupByName(groupName);
        if (!group){
            throw new Error('Group not found');
        }
        const [userGroup, created] = await models.usergroups.findOrCreate({
            where: { userid: userId, groupid: group.id },
            defaults: { userid: userId, groupid: group.id }
        });

        if (!userGroup){
            throw new Error('Cannot add user to group');
        }

        return userGroup;
    }

    /**
     * Remove a user from a group by their user ID and the group name.
     * @param {number} userId - The ID of the user.
     * @param {string} groupName - The name of the group.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     * @throws {Error} - Throws an error if the group cannot be found or the user cannot be removed from the group.
     */
    static async removeUserFromGroup(userId, groupName) {
        const { models } = await getDatabase();
        //const group = await models.accessgroup.findOne({where: {groupname: groupName}});
        const group = await AccessGroupController.getGroupByName(groupName);
        if (!group){
            throw new Error('Group not found');
        }
        return await models.usergroups.destroy({where: {userid: userId, groupid: group.id}});
    }

    /**
     * Add a user to the default group by their user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Object>} - A promise that resolves to the user group object.
     * @throws {Error} - Throws an error if the default group cannot be found or the user cannot be added to the group.
     */
    static async addUserToDefaultGroup(userId) {
        const { models } = await getDatabase();
        const group = await AccessGroupController.getGroupByName('USER');
        if (!group){
            throw new Error('Group not found');
        }
        const [userGroup, created] = await models.usergroups.findOrCreate({
            where: { userid: userId, groupid: group.id },
            defaults: { userid: userId, groupid: group.id }
        });

        if (!userGroup){
            throw new Error('Cannot add user to group');
        }
    }

}

module.exports = UserGroupsController;