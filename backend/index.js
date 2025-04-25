const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const helmet = require('helmet')
const cors = require('cors');
const routes = require('./src/routes/index')
// Initialize MongoDB connection
require('./src/dao/MongooseConfig');
require("dotenv").config();

// Create express app
const app = express();

const allowedOrigins = ['http://localhost:3001','http://localhost:4001'];
app.use(cors({
  origin: allowedOrigins
}));

app.use(helmet());
app.disable('x-powered-by');
app.disable('etag');
app.set('trust proxy', true);

// app.use(formData.parse());
//app.use(morgan('combined', { stream: winston.stream }));
//app.use(bodyParser.json({ limit: '100mb', parameterLimit: 100000 }));
//app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));
app.use(bodyParser.json({ limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true}));

app.use('/vignanAPI', routes);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ status: "Failure",code:400, message: "Requested data cannot be processed. Please try again with valid request."}); // Bad request
    }
    next();
});

//const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  //unhandledRejections.set(promise, reason);
  console.log("unhandledRejection :::: ", reason);
});

process.on('rejectionHandled', (promise) => {
  //unhandledRejections.delete(promise);
  console.log("rejectionHandled:::: ");
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

app.listen(process.env.PORT, () => { 
    console.log('Server is listening at http://localhost:%s', process.env.PORT); 
});