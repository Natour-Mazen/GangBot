const express = require('express');
const router = express.Router();
const ProjectController = require("../../database/controllers/projectController");


router.get('/get-user-projects', async (req, res) => {
    const user = req.connectedUser;
    const projects = await ProjectController.getProjectsByUserId(user.id);
    console.log(projects);
    res.json(projects);
})

module.exports = router;
