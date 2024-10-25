const projectController = require('../database/controllers/projectController');

const validateApiKeyMiddleware = () => async (req, res, next) => {
    const apiKey = req.headers['authorization'];

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is missing' });
    }

    const project = await projectController.getProjectByAPIKey(apiKey);

    if (!project) {
        return res.status(401).json({ message: 'Invalid API key' });
    }

    const currentDate = new Date();
    if (project.apiKeyExpirationDate && new Date(project.apiKeyExpirationDate) < currentDate) {
        return res.status(401).json({ message: 'API key has expired' });
    }

    // Add the project to the request to use it more easily
    req.clientProject = project;

    // Move to the next function (middleware or route manager)
    next();
};

module.exports = validateApiKeyMiddleware;