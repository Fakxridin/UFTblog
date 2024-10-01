const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Make sure you have some authentication strategy set up
        return next();
    }
    res.status(403).json({ message: 'Unauthorized access' });
};

module.exports = { ensureAuthenticated };