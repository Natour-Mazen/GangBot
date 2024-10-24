const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class ProjectController {
    static async getIfExistOrCreate(userId,repoName) {
        const { models } = await getDatabase();
        const [project, created] = await models.projects.findOrCreate({
            where: { reponame: repoName, userid: userId },
            defaults: {
                reponame: repoName,
            },
        });
        return project;
    }

    static async getProjectById(id) {
        const { models } = await getDatabase();
        const project = await models.projects.findOne({
            where: { id },
        });
        return project;
    }

    // CRUD operations for Projects
    static async createProject(userId, repoName) {
        const { models } = await getDatabase();
        return await models.projects.create({
            userid: userId,
            reponame: repoName,
        });
    }

    static async updateProject(id, repoName) {
        const project = await ProjectController.getProjectById(id);
        await project.update({reponame: repoName});
    }

    static async deleteProject(id) {
        const { models } = await getDatabase();
        const [project, deleted] = await models.projects.destroy({
            where: {
                id,
            }
        });
        return { project, deleted };
    }

    static async getProjectsByUserId(userId) {
        const { models } = await getDatabase();
        return await models.projects.findAll({
            where: {
                userid: userId,
            }
        });
    }

    static async getProjectByRepoName(userId, repoName) {
        const { models } = await getDatabase();
        return await models.projects.findOne({
            where: {
                userid: userId,
                reponame: repoName,
            }
        });
    }

}

module.exports = ProjectController;