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
}

module.exports = ProjectController;