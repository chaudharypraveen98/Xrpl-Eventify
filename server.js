import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
//connect database
//connectDB()

//dotenv config
dotenv.config()

const app = express()

//Creating API for user
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

var whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://praveenchaudhary.in']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
import nftRoutes from './backend/routes/XummApi.js';
app.use('/api', cors(corsOptions), nftRoutes)

const PORT = process.env.PORT

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`Cors enabled App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))


