const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const trainerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate(value) {
                let regex = /^.*(?=.{8,})(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/.test(value)
                if (!regex)
                    throw new Error("Password must contain one uppercase letter, one non alphanumeric char and one digit, minimum 8 charts");
            }
        },
        heroes: [
            {
                hero: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'Hero'
                }
            }
        ]
    }, {
})


trainerSchema.pre("save", async function (next) {
    const trainer = this;
    if (trainer.isModified('password')) {
        trainer.password = await bcrypt.hash(trainer.password, 8);
    }
    next();
})


trainerSchema.methods.generateToken = async function (next) {
    const trainer = this;
    const token = jwt.sign(
        {
            _id: trainer._id
        },
        process.env.SECRET_TOKEN,
        {
            expiresIn: '1h'
        }
    );
    return token;
}

const Trainer = mongoose.model("Trainer", trainerSchema)

module.exports = Trainer;