const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');


router.get('/get-repos',  async (req, res) => {
    const repos = await GithubController.getRepos(req.connectedUser.gitToken);
    res.json(repos);
})

router.get('/get-branches',async (req, res) => {
    const repo = req.query.repo;
    const branches = await GithubController.getBranches(req.connectedUser, repo);
    res.json(branches);
})

module.exports = router;
