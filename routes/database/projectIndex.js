const express = require('express');
const router = express.Router();
const ProjectController = require("../../database/controllers/projectController");
const projectController = require("../../database/controllers/projectController");

router.get('/', async (req, res) => {
    const user = req.connectedUser;
    const projects = await ProjectController.getProjectsByUserId(user.id);
    console.log(projects);
    res.json(projects);
})

router.post('/', async (req, res) => {
    const {repoName, branch} = req.query;
    const [project, created] =  projectController.createProject(req.connectedUser.id, repoName, repoName, branch); // we use the repoName as default projectName

    if(!created){
        return res.status(400).json({
            error: "An error occured while creating the project"
        })
    }

    return res.json({
        project : project
    })
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const project = projectController.getProjectById(id)
    if(!project){
        return res.status(400).json({
            error: "An error occurred while getting the project"
        })
    }

    return res.json({
        project : project
    })
});

router.put('/:id/projectname/:newName', async (req, res) => {
    const {id, newName} = req.params;
    const projectUpdated = projectController.updateProjectName(id, newName)
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
