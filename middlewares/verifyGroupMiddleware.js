
function verifyGroup(groups) {
  return (req, res, next) => {
    const user = req.connectedUser;
    const userGroups = user.groups;
    console.log("userGroups: ",userGroups);

    if(!userGroups) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const isAuthorized = groups.some((group) => userGroups.includes(group));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  };
}

module.exports = verifyGroup;