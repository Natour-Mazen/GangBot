const express = require('express');
const router = express.Router();
const GithubProvider = require('../../../providers/auth/githubProvider');
const {setAuthCookieAndRedirectHandler} = require("../../../handlers/authCookieAndRedirectHandler");

router.get('/', (req, res) => {
  const provider = new GithubProvider();
  const githubAuthUrl = provider.getAuthUrl();
  res.redirect(githubAuthUrl);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Github code is missing, try again' });
  }

  try {
    const provider = new GithubProvider();
    const accessToken = await provider.handleOAuthCallback(code);

    setAuthCookieAndRedirectHandler(res, accessToken);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
    console.log(error);
  }
});


module.exports = router;
