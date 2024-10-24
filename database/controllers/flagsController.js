const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class FlagsController {

    // CRUD operations for Flags
    static async createFlag(projectId, branch, content) {
        const { models } = await getDatabase();
        // const db_flag  = await models.flags.create({
        //     projectid: projectId,
        //     branch: branch,
        //     content: content,
        // });
        const [db_flag, created] = await models.flags.findOrCreate({
            where: { projectid: projectId, branch: branch },
            defaults: {
                projectid: projectId, branch: branch
            },
        });

        db_flag.content = content;
        await db_flag.save();
        return db_flag;
    }

    static async updateFlag(projectId, branch, content) {
        const flag = await FlagsController.getFlag(projectId, branch);
        await flag.update({content: content});
    }

    static async deleteFlag(projectId, branch) {
        const { models } = await getDatabase();
        const [db_flag, deleted] = await models.flags.destroy({
            where: {
                projectid: projectId,
                branch: branch,
            }
        });
        return { db_flag, deleted };
    }

    static async getFlag(projectId, branch) {
        const { models } = await getDatabase();
        return await models.flags.findOne({
            where: {
                projectid: projectId,
                branch: branch,
            }
        });
    }

    static async getAllFlagsProject(projectId) {
        const { models } = await getDatabase();
        return await models.flags.findAll({
            where: {
                projectid: projectId,
            }
        });
    }

}

module.exports = FlagsController;