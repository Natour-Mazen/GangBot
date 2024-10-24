const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');
const AuthController = require('../../controllers/authController');
const handleResponse = require("../../handlers/responseHandler");


router.get('/get-user', async (req, res) => {
    const {userData, response_code, message} = await AuthController.getUserProfileInfos(req.connectedUser);
    handleResponse(res, userData, response_code, message);
})


router.get('/get-repos',  async (req, res) => {
    const {repos, response_code, message} = await GithubController.getRepos(req.connectedUser);
    handleResponse(res, repos, response_code, message);
})

router.get('/get-branches',async (req, res) => {
    const repoName = req.query.repoName;
    const {branches, response_code, message} = await GithubController.getBranches(req.connectedUser, repoName);
    handleResponse(res, branches, response_code, message);
})

router.get("/get-flag-file", async (req, res) => {
    const {repoName, branch} = req.query;
    const connectedUser = req.connectedUser;
    const {flagFile, response_code, message} = await GithubController.getFlagFile(connectedUser, repoName, branch);
    handleResponse(res, flagFile, response_code, message);
});

module.exports = router;
