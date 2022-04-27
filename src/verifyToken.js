const jwt = require("jsonwebtoken");

const verifyTokenFactory = (secret) => (req, res, next) => {

    if (!req.headers['authorization']) {
        return res.status(403).json({error: "Invalid authorization header"});
    }
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if (!bearerToken) {
        return res.status(403).json({error: "A token is required for authentication"});
    }
    try {
        const decoded = jwt.verify(bearerToken, secret);
        if (!decoded.userId || !decoded.role || decoded.iss != "https://www.netguru.com/") {
            return res.status(401).json({error: "Invalid token content"});
        }
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({error: "Invalid Token"});
    }
    return next();
};

module.exports = verifyTokenFactory;