const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
require("./src/db/mongoose");

const trainerRouter = require("./src/routers/trainerRouter");


app.use(cors());
app.use(express.json());
app.use(trainerRouter)


app.listen(port, () => {
    console.log(`Server connnected: ${port}`);
});