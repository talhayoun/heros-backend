const mongoose = require("mongoose");
const logger = require("../../logs/index");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true
}, (err, cb) => {
    if (!err)
        logger().info('Connected to mongodb');
    else
        logger().warn("Failed to connect to mongodb");
});
