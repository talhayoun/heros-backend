const express = require("express")
const bcrypt = require("bcryptjs");
const moment = require("moment");
const mongoose = require("mongoose");
const router = express.Router();
const Hero = require("../models/heroSchema");
const auth = require("../middleware/auth");
const { calculateHeroPower } = require("../middleware/trainer");

router.patch("/trainer/hero/update", auth, calculateHeroPower, async (req, res, next) => {
    try {
        const hero = req.hero;
        const newHeroPower = req.newHeroPower;
        const currentHeroPower = req.currentHeroPower;

        let todaysDate = moment().format('YYYY-MM-DD');

        let isHeroDateEqualsTodays = hero.lastTrainDate === todaysDate
        if (hero.trainingCount >= 5 && isHeroDateEqualsTodays)
            return res.send({ err: "Hero has already trained five times today" });

        let restartHeroTrains = false;
        if (!isHeroDateEqualsTodays) restartHeroTrains = true;

        let updatedTrainingCount = restartHeroTrains ? -hero.trainingCount + 1 : 1
        const heroUpdate = await Hero.findOneAndUpdate(
            { _id: req.body.heroID },
            {
                $inc:
                {
                    trainingCount: updatedTrainingCount
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
        console.log(error)
        next({ status: 404, msg: error.message });
    }
})


router.get("/trainer/heros/all", auth, async (req, res, next) => {
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
        next({ status: 404, msg: "Heros aren't found" })
    }
})


module.exports = router;