const express = require('express');
const router = express.Router();
const GithubProvider = require('../../../providers/auth/githubProvider');
const {setAuthCookieAndRedirectHandler} = require("../../../handlers/authCookieAndRedirectHandler");
const dotenv = require('dotenv');
const {setProviderCookieHandler} = require("../../../handlers/providerCookieHandler");
const ProviderTypes = require("../../../providers/providerTypes");
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
    const accessToken = await provider.handleOAuthCallback(code);

    setAuthCookieAndRedirectHandler(res, accessToken);
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
    const accessToken = await provider.exchangeCodeForAccessToken(code);
    const userInfos = await provider.fetchUserInfo(accessToken);

    //res.json({ accessToken });
    setProviderCookieHandler(res, accessToken, userInfos.id, userInfos.login ,  ProviderTypes.GITHUB);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
    console.log(error);
  }
});


module.exports = router;
