const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');


router.get('/get-repos',  async (req, res) => {
    const {repos, response_code, message} = await GithubController.getRepos(req.connectedUser);
    if(response_code >= 400) {
        return res.status(response_code).json({message: message});
    }
    res.json(repos);
})

router.get('/get-branches',async (req, res) => {
    const repo = req.query.repo;
    const {branches, response_code, message} = await GithubController.getBranches(req.connectedUser, repo);
    if(response_code >= 400) {
        return res.status(response_code).json({message: message});
    }
    return res.json(branches);
})

router.get("/get-flag-file", async (req, res) => {
    const connectedUser = req.connectedUser;
    const repoName = req.query.repoName;
    const branch = req.query.branch;
    const {FlagFile, response_code, message} = await GithubController.getFlagFile(connectedUser, repoName, branch);
    if(response_code >= 400) {
        return res.status(response_code).json({message: message});
    }
    return res.json(FlagFile);
});

module.exports = router;
