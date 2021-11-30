const mongoose = require("mongoose");
const moment = require("moment");

const heroSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        suitColor: [String],
        ability: {
            type: String,
            enum: ['attacker', 'defender']
        },
        lastTrainPower: {
            type: mongoose.Schema.Types.Decimal128
        },
        currentPower: {
            type: mongoose.Schema.Types.Decimal128
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Trainer'
        },
        trainingCount: {
            type: Number
        },
        lastTrainDate: {
            type: String
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
);


heroSchema.methods.validateTrainingCount = async function (next) {
    const hero = this;
    let todaysDate = moment().format('YYYY-MM-DD');
    let isHeroDateEqualsTodays = hero.lastTrainDate === todaysDate
    if (!isHeroDateEqualsTodays) {
        hero.lastTrainDate = todaysDate;
        hero.trainingCount = 0;
        await hero.save();
    }
}

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;