const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const logger = require("./logs/index");
require("./src/db/mongoose");

const trainerRouter = require("./src/routers/trainerRouter");
const heroRouter = require("./src/routers/heroRouter");


app.use(cors());
app.use(express.json());
app.use(trainerRouter)
app.use(heroRouter);


app.use((err, req, res, next) => {
    logger().error(`${err.status} || ${err.msg}  -  ${req.originalUrl}  -  ${req.method}  - ${req.ip}`);
    res.status(err.status || 500).send(err.msg);
})
app.listen(port, () => {
    console.log(`Server connected: ${port}`);
    logger().info("Server connected")
});