const axios = require('axios');
const dotenv = require('dotenv');
const { Flags } = require('../database/models/flags');
const getDatabase = require("../database/config");

dotenv.config();


class FlagsController {


    // CRUD operations for Flags
    static async createFlag(projectId, branch, content) {
        const { models } = await getDatabase();
        const [db_flag, created] = await models.Flags.create({
            projectid: projectId,
            branch: branch,
            content: content,
        });
        return { db_flag, created };
    }

    static async updateFlag(projectId, branch, content) {
        const { models } = await getDatabase();
        const [db_flag, updated] = await models.Flags.update({
            projectid: projectId,
            branch: branch,
            content: content,
        });
        return { db_flag, updated };
    }

    static async deleteFlag(projectId, branch) {
        const { models } = await getDatabase();
        const [db_flag, deleted] = await models.Flags.destroy({
            where: {
                projectid: projectId,
                branch: branch,
            }
        });
        return { db_flag, deleted };
    }

    static async getFlag(projectId, branch) {
        const { models } = await getDatabase();
        return await models.Flags.findOne({
            where: {
                projectid: projectId,
                branch: branch,
            }
        });
    }

    static async getAllFlagsProject(projectId) {
        const { models } = await getDatabase();
        return await models.Flags.findAll({
            where: {
                projectid: projectId,
            }
        });
    }





}

module.exports = FlagsController;