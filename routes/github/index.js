const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');
const AuthController = require('../../controllers/authController');
const handleResponse = require("../../handlers/responseHandler");


router.get('/user', async (req, res) => {
    const {userData, response_code, message} = await AuthController.getUserProfileInfos(req.connectedUser);
    handleResponse(res, userData, response_code, message);
})


router.get('/repos',  async (req, res) => {
    const {repos, response_code, message} = await GithubController.getRepos(req.connectedUser);
    handleResponse(res, repos, response_code, message);
})

router.get('/branches',async (req, res) => {
    const repoName = req.query.repoName;
    const {branches, response_code, message} = await GithubController.getBranches(req.connectedUser, repoName);
    handleResponse(res, branches, response_code, message);
})

router.get("/flag-file", async (req, res) => {
    const {repoName, branch, all_branch} = req.query;
    const connectedUser = req.connectedUser;
    let flagFiles = [];
    if(all_branch === "true"){
        const {branches, response_code, message} = await GithubController.getBranches(connectedUser, repoName);
        if(response_code >= 400){
            return handleResponse(res, [], response_code, message);
        }
        for(const branch of branches) {
            const {
                flagFile,
                response_code,
                message
            } = await GithubController.getFlagFile(connectedUser, repoName, branch.name);
            if(response_code >= 400){
                flagFiles.push({error: "could not get flag file for branch " + branch.name});
                continue;
            }
            flagFile.branch = branch.name;
            flagFiles.push(flagFile);
        }
    }else {
        const {flagFile, response_code, message} = await GithubController.getFlagFile(connectedUser, repoName, branch);
        if(response_code >= 400){
            return handleResponse(res, [], response_code, message);
        }
        flagFiles.push(flagFile);
    }
    handleResponse(res, flagFiles, 200, "");
});

module.exports = router;