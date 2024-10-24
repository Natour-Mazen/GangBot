const express = require('express');
const router = express.Router();
const flagsValidatorController = require("../../controllers/flagsValidatorController");
const flagsController = require("../../database/controllers/flagsController");
const projectController = require("../../database/controllers/projectController");
const userController = require("../../database/controllers/userController");

router.post('/save-flag-file',  async (req, res) => {
    const {flag_file, filetype, repoName, branch } = req.body;
    const { isFlagFile, flags} = flagsValidatorController.isValidFlagFile(flag_file, filetype);

    if(!isFlagFile){
        return res.status(400).send("Not a valid flag file");
    }

    const user = await userController.getUser(req.connectedUser.name);
    const project = await projectController.getIfExistOrCreate(user.id, repoName);
    const flag = await flagsController.createFlag(project.id, branch, flags);

    res.json(flag.id);
})

router.get('/get-flag-file', async (req, res) => {
    const { projectId, branch } = req.query;
    const user = await userController.getUser(req.connectedUser.name);
    const project = await projectController.getProjectById(projectId);
    const flag = await flagsController.getFlag(project.id, branch);
    res.json(flag);
});

router.get('/get-all-flag-file', async (req, res) => {
    const { projectId } = req.query;
    const user = await userController.getUser(req.connectedUser.name);
    const project = await projectController.getProjectById(projectId);
    const flag = await flagsController.getAllFlagsProject(project.id);
    res.json(flag);
});

module.exports = router;
