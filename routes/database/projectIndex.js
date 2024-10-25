const express = require('express');
const router = express.Router();
const projectController = require("../../database/controllers/projectController");

router.get('/', async (req, res) => {
    const projects = await projectController.getProjectsByUserId(req.connectedUser.id);
    if(!projects){
        return res.status(400).json({
            error: "An error occurred while getting the projects"
        })
    }

    //filter the project object to remove the userid
    for(const project of projects){
        delete project.dataValues.userid
    }

    res.json(projects);
})

router.post('/', async (req, res) => {
    const {repoName, branch} = req.body;
    const [project, created, error_message] = await projectController.createProject(req.connectedUser.id, repoName, repoName, branch); // we use the repoName as default projectName

    if(!created){
        return res.status(400).json({
            error: error_message !== "" ? error_message : "An error occurred while creating the project"
        })
    }

    //filter the project object to remove the userid
    delete project.dataValues.userid;

    return res.json({
        project : project
    })
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const project = await projectController.getProjectById(id)
    if(!project){
        return res.status(400).json({
            error: "An error occurred while getting the project"
        })
    }

    //filter the project object to remove the userid
    delete project.dataValues.userid;

    return res.json({
        project : project
    })
});

router.put('/:id/projectname/:newName', async (req, res) => {
    const {id, newName} = req.params;
    const projectUpdated = await projectController.updateProjectName(id, newName)
    if(!projectUpdated){
        return res.status(400).json({
            error: "An error occurred while updating the project name"
        })
    }

    return res.json({
        message: "Project Name updated successfully"
    })
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { deleted, _ } = await projectController.deleteProject(id);

    if (!deleted) {
        return res.status(404).json({
            error: "Project not found or already deleted",
        });
    }

    return res.json({
        message: "Project deleted successfully"
    });
});

module.exports = router;
