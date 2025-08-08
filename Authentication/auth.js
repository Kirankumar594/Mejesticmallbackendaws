const jwt = require('jsonwebtoken');
const { isEmpty, isValidObjectId } = require("../Validators/validator");

// Authentication Middleware
const Authentication = async function (req, res, next) {
    try {
        // Extract token from headers
        let token = req.headers["authorization"] || req.headers["Authorization"];
        if (!token) return res.status(403).json({ error: "Please provide a token in the header" });

        // Verify the token
        let token1 = token.split(" ").pop();
        jwt.verify(token1, "Abhinandhan", function (err, decoded) {
            if (err) return res.status(403).json({ error: "Invalid token" });

            // Check token expiration
            if (Date.now() > decoded.exp * 1000) {
                return res.status(401).json({ error: "Session expired" });
            }

            // Attach userId to request
            req.userId = decoded.userId;
            next();
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Authorization Middleware
const Authorization = async function (req, res, next) {
    try {
        // Extract token from headers
        let token = req.headers["authorization"] || req.headers["Authorization"];
        if (!token) return res.status(403).json({ error: "Please provide a token in the header" });

        // Verify the token
        let token1 = token.split(" ").pop();
        let decodedToken = jwt.verify(token1, "Abhinandhan");

        // Extract userId from the route params or request body
        let userId = req.params.authId || req.body.authId;
        if (!userId) return res.status(400).json({ error: "authId is required" });

        // Validate userId format
        if (!isValidObjectId(userId)) return res.status(406).json({ error: "authId is not valid" });

        // Check if the userId in the token matches the requested userId
        if (userId !== decodedToken.userId) return res.status(401).json({ error: "Not authorized!" });

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { Authentication, Authorization };
