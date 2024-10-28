const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class GroupController {
    static async getGroupsNamesByUserId(userId) {
        const { models } = await getDatabase();
        const group_ids =  await models.usergroups.findAll({where: {userid: userId}});
        let groups = [];
        for(const group_id of group_ids){
            const group = await models.accessgroup.findOne({where: {id: group_id.groupid}});
            groups.push(group);
        }
        return groups;
    }
}

module.exports = GroupController;