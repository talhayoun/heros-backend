const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainerSchema");

const auth = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) return res.status(401).send({ err: "No token, login first" });

        const isVerified = jwt.verify(token, process.env.SECRET_TOKEN);
        if (!isVerified) return res.status(403).send({ err: "Token is invalid" });

        const trainer = await Trainer.findById({ _id: isVerified._id });
        if (!trainer) return res.status(400).send({ err: "Failed to find user by token id" });

        req.user = trainer;
        next();
    } catch (error) {
        res.status(403).send({ err: "Auth failed" });
    }
}


module.exports = auth;