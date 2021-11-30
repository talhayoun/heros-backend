const mongoose = require("mongoose");
const moment = require("moment");
const Hero = require("../models/heroSchema");
const Trainer = require("../models/trainerSchema");
const trainerID = '61a4a3d9eb7fe2c73f11d118'
let newDate = moment().format('YYYY-MM-DD');
const heroes =
    [
        new Hero({
            name: "Pikachu",
            suitColor: ["yellow", "red"],
            ability: "attacker",
            currentPower: 132.4,
            trainingCount: 0,
            trainer: trainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/icon-pikachu-transparent-background-2e770213e63043026fed9578580be392.png"
        }),
        new Hero({
            name: "Charmander",
            suitColor: ["cyan", "brown", "yellow"],
            ability: "attacker",
            currentPower: 84.5,
            trainingCount: 0,
            trainer: trainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/pokemon-go-pikachu-squirtle-charmander-pokemon-png-05712d2c4e89106fec1bde027633d0c9.png"
        }),
        new Hero({
            name: "Bulbasaur",
            suitColor: ["green", "cyan"],
            ability: "attacker",
            currentPower: 72.8,
            trainingCount: 0,
            trainer: trainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/pokemon-red-and-blue-ash-ketchum-bulbasaur-wikia-pokemon-png-a206e18427b09658827e2da4567c5cdc.png"
        }),
        new Hero({
            name: "Flaeon",
            suitColor: ["red", "yellow"],
            ability: "attacker",
            currentPower: 53.7,
            trainingCount: 0,
            trainer: trainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/5bbc0588b45d1-48b6b27aac180cd993dc0c23903bdf96.png"
        }),
        new Hero({
            name: "Chikorita",
            suitColor: ["lightgreen", "green"],
            ability: "defender",
            currentPower: 28.3,
            trainingCount: 0,
            trainer: trainerID,
            lastTrainDate: newDate,
            image: "https://matrix-heroes.s3.eu-west-2.amazonaws.com/5bbeb842744b8-cb41eb513278cdda0b9811cd4ce13d5a.png"
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
    let trainer = await Trainer.findById({ _id: trainerID });

    heroesIds.map((heroID) => {
        trainer.heroes = trainer.heroes.concat({ hero: heroID });
    })
    await trainer.save()
    console.log("Done seeding heroes in trainer schema");
    mongoose.disconnect();
}

addHeroesToTrainer();


module.exports = heroes;