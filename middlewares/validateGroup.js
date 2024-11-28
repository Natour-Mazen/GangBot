
const validateGroup = (authorizedGroup) => (req, res, next) => {
  const user = req.connectedUser;
  const userGroups = user.groups;

  if(!userGroups) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const isAuthorized = authorizedGroup.some((group) => userGroups.includes(group));

  if (!isAuthorized) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
}

module.exports = validateGroup;