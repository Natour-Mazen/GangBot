const express = require('express');
const router = express.Router();
const GithubProvider = require('../../../controllers/authentication/vcs/github');
const dotenv = require('dotenv');
const {setAuthCookie} = require("../../../handlers/authCookie");
const {setProviderCookie} = require("../../../handlers/providerCookie");

dotenv.config();
const { SERVER_HOST_URL } = process.env;

router.get('/', (req, res) => {
  const provider = new GithubProvider();
  const githubAuthUrl = provider.getAuthUrl();
  res.redirect(githubAuthUrl);
});

router.get('/getToken', (req, res) => {
  const provider = new GithubProvider();
  const githubAuthUrl = provider.getAuthUrl(`${SERVER_HOST_URL}/auth/github/callback/githubToken`);
  res.redirect(githubAuthUrl);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Github code is missing, try again' });
  }

  try {
    const provider = new GithubProvider();
    const accessTokenID = await provider.handleOAuthCallback(code);

    setAuthCookie(res, accessTokenID);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
    console.log(error);
  }
});

router.get('/callback/githubToken', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Github code is missing, try again' });
  }

  try {
    const provider = new GithubProvider();
    const accessTokenID = await provider.handleOAuthProviderCallback(code);

    await setProviderCookie(res, accessTokenID);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
    console.log(error);
  }
});


module.exports = router;
