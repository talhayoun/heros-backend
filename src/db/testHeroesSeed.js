const mongoose = require("mongoose");
const moment = require('moment');
const Hero = require("../models/heroSchema");
const Trainer = require("../models/trainerSchema");
const testTrainerID = '61a4d2a510590e624b3d0335';

let newDate = moment().format('YYYY-MM-DD');

const heroes =
    [
        new Hero({
            name: "Thanos",
            suitColor: ["blue", "lightblue"],
            ability: "attacker",
            currentPower: 232.4,
            trainingCount: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Thanos-PNG-Free-Download.png"
        }),
        new Hero({
            name: "Wonder Woman",
            suitColor: ["red"],
            ability: "attacker",
            currentPower: 154.5,
            trainingCount: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Wonder-Woman-Free-PNG-Image.png"
        }),
        new Hero({
            name: "Invisible-Woman",
            suitColor: ["blue", "black"],
            ability: "attacker",
            currentPower: 90.8,
            trainingCount: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Invisible-Woman-Free-Download-PNG.png"
        }),
        new Hero({
            name: "Hawkeye",
            suitColor: ["red", "yellow"],
            ability: "defender",
            currentPower: 64.3,
            trainingCount: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Hawkeye-Download-PNG.png"
        }),
        new Hero({
            name: "Aquaman",
            suitColor: ["lightgreen", "green", "red"],
            ability: "defender",
            currentPower: 195.3,
            trainingCount: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Aquaman-PNG-Clipart.png"
        }),
    ]

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true
});

let heroesIds = [];

heroes.map(async (hero, index) => {
    heroesIds.push(hero._id);
    await hero.save((err, result) => {
        if (index === heroes.length - 1) {
            console.log("Done seeding heroes");
        }
    })
})

const addHeroesToTrainer = async () => {
    let trainer = await Trainer.findById({ _id: testTrainerID });

    heroesIds.map((heroID) => {
        trainer.heroes = trainer.heroes.concat({ hero: heroID });
    })
    await trainer.save()
    console.log("Done seeding heroes in trainer schema");
    mongoose.disconnect();
}

addHeroesToTrainer();


module.exports = heroes;