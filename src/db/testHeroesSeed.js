const mongoose = require("mongoose");
const Hero = require("../models/heroSchema");
const Trainer = require("../models/trainerSchema");
const testTrainerID = '61a35009a7eed5f73302bc6c';

let newDate = new Date();
newDate = newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDay()

const heroes =
    [
        new Hero({
            name: "Thanos",
            suitColor: ["blue", "lightblue"],
            ability: "attacker",
            currentPower: 232.4,
            numOfTrains: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Thanos-PNG-Free-Download.png"
        }),
        new Hero({
            name: "Wonder Woman",
            suitColor: ["red"],
            ability: "attacker",
            currentPower: 154.5,
            numOfTrains: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Wonder-Woman-Free-PNG-Image.png"
        }),
        new Hero({
            name: "Invisible-Woman",
            suitColor: ["blue", "black"],
            ability: "attacker",
            currentPower: 90.8,
            numOfTrains: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Invisible-Woman-Free-Download-PNG.png"
        }),
        new Hero({
            name: "Hawkeye",
            suitColor: ["red", "yellow"],
            ability: "defender",
            currentPower: 64.3,
            numOfTrains: 0,
            trainer: testTrainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/Hawkeye-Download-PNG.png"
        }),
        new Hero({
            name: "Aquaman",
            suitColor: ["lightgreen", "green", "red"],
            ability: "defender",
            currentPower: 195.3,
            numOfTrains: 0,
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