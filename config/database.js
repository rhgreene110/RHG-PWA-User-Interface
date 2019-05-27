//Import the mongoose module
var mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Set up default mongoose connection
var mongoDBurl = 'mongodb://rhg-pwa-db:suCMnGWwwm3Ykg5LD8VzBESIrk9mAKNJ0bVuIvDSXrFWpWrPIENPmwfp5RZyTHt5XxG26uwhzDlJpdc8fFuOmA%3D%3D@rhg-pwa-db.documents.azure.com:10255/RHG-PWA-mongodb-collection?ssl=true';
mongoose.connect(mongoDBurl, {
    useNewUrlParser: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', (callback) => {
    console.log('MongoDB connected！！');
});
// create heroActivity schema
// This is created to provide an array structure to log each time a user logs into the system. 
//
// const heroActivityLogSchema = new Schema({
//    loginDateTime : String,
//     device-ip:  String
// });

//create schema
const heroSchema = new Schema({
    name: String,
    message: String,
    first_name: String,
    middle_initial: String,
    last_name: String,
    street_address: String,

    country_name: String,
    state_name: String,
    city_name: String,

    day_of_birth: Date,
    driver_license_number: String,
    driver_license_state: String,
    payment_card: String,
    payment_card_id_number: String,
    payment_card_expiration_date: Date,

    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: String,

    // user login activities
    heroactivitylog: [{
        loginDateTime: String,
        loginSuccess: Boolean,
        device_ip: String,
        device_os: String,
        loginnumber: {
            type: Number,
            default: 0,
        },
    }],

}, {
    timestamps: true,
});


//create model
const Hero = mongoose.model('Hero', heroSchema);
module.exports = Hero;