const express = require("express");
const Trainer = require("../models/trainerSchema");
const router = express.Router();
const auth = require("../middleware/auth");


router.post("/signup", async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).send({ err: "Username and password are required." });


        const trainer = await new Trainer({ username, password });
        if (!trainer)
            return res.status(500).send({ err: "Internet connection issue" });


        await trainer.save();
        res.send({ trainer: { _id: trainer._id, username: trainer.username } })
    } catch (error) {
        next({ status: 404, msg: "Failed to signup user" })
    }
})


router.post("/login", async (req, res, next) => {
    try {
        const trainer = await Trainer.findTrainerAndValidatePassword(req.body.username, req.body.password);

        const token = await trainer.generateToken();
        await trainer.populateHeros();

        res.send({ token, username: trainer.username, heroes: [...trainer.heroes], id: trainer._id });
    } catch (error) {
        next({ status: 404, msg: error.message });
    }
})



router.get('/trainer/verify', auth, async (req, res, next) => {
    try {
        const trainer = req.user;

        await trainer.populateHeros();

        res.send({ username: req.user.username, heroes: trainer.heroes, id: req.user._id });
    } catch (error) {
        next({ status: 500, msg: error.message });
    }
})

module.exports = router;