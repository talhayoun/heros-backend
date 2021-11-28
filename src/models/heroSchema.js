const mongoose = require("mongoose");

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
        numOfTrains: {
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


const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;