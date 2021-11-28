const Hero = require("../models/heroSchema");

const calculateHeroPower = async (req, res, next) => {
    try {
        const hero = await Hero.findById({ _id: req.body.heroID });
        const trainer = req.user;
        let trainerHasHero = trainer.heroes.find(curField => curField.hero.toString() == req.body.heroID);
        if (!trainerHasHero) return res.status(403).send({ err: "This trainer doesn't have that hero" });


        let powerGrowth = Math.floor(Math.random() * 10);
        let currentHeroPower = parseFloat(hero.currentPower)
        let newHeroPower = (powerGrowth / 100) * currentHeroPower;
        newHeroPower = (currentHeroPower || 0) + newHeroPower

        req.hero = hero;
        req.newHeroPower = newHeroPower;
        req.currentHeroPower = currentHeroPower
        next()
    } catch (error) {
        res.status(404).send(error.message);
    }
}

module.exports = { calculateHeroPower };