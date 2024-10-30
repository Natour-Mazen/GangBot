const express = require('express');
const router = express.Router();
const GithubRouter = require('./githubIndex');

router.use('/github', GithubRouter);

router.get('/logout', (req, res) => {
    res.clearCookie('ff_access_token', { path: '/', sameSite: 'None', secure: true });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
