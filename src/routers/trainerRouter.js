const express = require("express");
const bcrypt = require("bcryptjs");
const Trainer = require("../models/trainerSchema");
const Hero = require("../models/heroSchema");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { calculateHeroPower } = require("../middleware/trainer");


router.post("/signup", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).send({ err: "Username and password are required." });


        const trainer = await new Trainer({ username, password });
        if (!trainer)
            return res.status(500).send({ err: "Internet connection issue" });


        await trainer.save();
        res.send({ trainer: { heroes: trainer.heroes, _id: trainer._id, username: trainer.username } })
    } catch (error) {
        console.log(error)
        res.status(404).send(error.message);
    }
})


router.post("/login", async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ username: req.body.username });
        if (!trainer) return res.status(403).send({ err: "Password or username is invalid" });


        const isPassMatch = await bcrypt.compare(req.body.password, trainer.password);
        if (!isPassMatch) return res.status(401).send({ err: "Password or username is invalid" });


        const token = await trainer.generateToken();
        await trainer.populate("heroes.hero");
        res.send({ token, username: trainer.username, heroes: [...trainer.heroes], id: trainer._id });
    } catch (error) {
        res.status(404).send({ err: "Failed to log in" });
    }
})



router.get("/trainer/heroes", async (req, res) => {
    try {
        const trainerID = req.query.trainer;
        const trainer = await Trainer.findById({ _id: trainerID });
        if (!trainer) return res.status(400).send({ err: "Trainer details not found" });

        await trainer.populate("heroes.hero");
        const heroes = trainer.heroes;

        res.send({ heroes });
    } catch (error) {
        res.status(404).send({ err: error.message });
    }
})

router.patch("/trainer/hero/update", auth, calculateHeroPower, async (req, res) => {
    try {
        const hero = req.hero;
        const newHeroPower = req.newHeroPower;
        const currentHeroPower = req.currentHeroPower;

        let todaysDate = new Date();
        todaysDate = todaysDate.getFullYear() + "-" + todaysDate.getMonth() + "-" + todaysDate.getDay();

        let isHeroDateEqualsTodays = hero.lastTrainDate === todaysDate
        if (hero.numOfTrains >= 5 && isHeroDateEqualsTodays)
            return res.send({ err: "Hero has already trained five times today" });

        let restartHeroTrains = false;
        if (!isHeroDateEqualsTodays) restartHeroTrains = true;

        let updatedNumOfTrains = restartHeroTrains ? -hero.numOfTrains + 1 : 1
        const heroUpdate = await Hero.findOneAndUpdate(
            { _id: req.body.heroID },
            {
                $inc:
                {
                    numOfTrains: updatedNumOfTrains
                },
                $set: {
                    currentPower: mongoose.Types.Decimal128(newHeroPower.toString()),
                    lastTrainDate: todaysDate,
                    lastTrainPower: mongoose.Types.Decimal128(currentHeroPower.toString())
                }
            },
            { new: true }
        );
        await heroUpdate.save()
        res.send(heroUpdate);
    } catch (error) {
        throw new Error(error.message)
    }
})

router.get('/trainer/verify', auth, async (req, res) => {
    try {
        const trainer = req.user;
        await trainer.populate('heroes.hero');
        res.send({ username: req.user.username, heroes: trainer.heroes, id: req.user._id });
    } catch (error) {
        throw new Error(error.message)
    }
})

router.get("/trainer/heros/all", auth, async (req, res) => {
    try {
        const pageNumber = req.query.page;
        let pagesNumToSkip = pageNumber >= 0 ? ((pageNumber - 1) * 6) : 0;

        const heros = await Hero.find({}).limit(6).skip(pagesNumToSkip);
        if (!heros)
            return res.status(404).send({ err: "Failed to find heros" });


        let totalPages = await Hero.countDocuments()
        let data = {
            heros,
            isComplete: totalPages > pagesNumToSkip + heros.length ? false : true
        };
        res.send({ data })
    } catch (error) {
        res.status(404).send({ err: "Can't find heros" });
    }
})

module.exports = router;