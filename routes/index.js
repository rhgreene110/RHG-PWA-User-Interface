﻿'use strict';
var express = require('express');
var router = express.Router();
var webpush = require('web-push');
var request = require('request');
var Hero = require('../config/database');

/* GET home page. */
/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.userId) {
        Hero.findById(req.session.userId)
            .then(data => {
                if (!data) {
                    return res.render('error', {
                        errmsg: err
                    });
                }
                console.log('findOne success');
                return res.render('index', {
                    layout: 'layout',
                    title: 'VIP',
                    userprofiler: data.username
                });
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    console.log(req.session.userId);
                    return res.render('error', {
                        errmsg: err
                    });
                }
                return res.render('error', {
                    errmsg: err
                });
            });
    } else {
        res.render('index', {
            title: 'Express Sample App',
            userprofiler: req.session.userId
        });
    }
});

router.get('/offline.html', function (req, res) {
    res.sendFile('./public/offline.html');
});

//webpush.generateVAPIDKeys();
//azure key
const vapidKeys = {
    publicKey: 'BMwXXlYzG4-WUlHU2Pi4BkaaoJ3WawH53kSW05xuIZPtttW7MQ9zHpNod6a2Pt88N5JTZZU1DiLDmNEbOxeGXHQ',
    privateKey: 'G4C17rwBaSBMu0j9EyUUQT0JRQOQEbFetr9zbSgQ1og'
};

webpush.setVapidDetails(
    'mailto:pwa@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

router.get('/vapidPublicKey', function (req, res) {
    res.send(vapidKeys.publicKey);
});

router.post('/register', function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
});

router.post('/sendNotification', function (req, res) {
    const subscription = req.body.subscription;
    const payload = 'notification';
    const options = null;

    webpush.sendNotification(subscription, payload, options)
        .then(function () {
            res.sendStatus(201);
        })
        .catch(function (error) {
            res.sendStatus(500);
            console.log(error);
        });
});

//post to function app
var functionurl = "https://function-app-v2b.azurewebsites.net/api/Function-V2B?code=2asEG6OSWZBgdMwLIlf2wWIdHkyhqK7UB0TajGdXa4ARaH0A8OWSvw==";
router.post('/postfunction', function (req, res) {
    request({
        url: functionurl,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {
            name: "azure, this is from my PWA app"
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("success");
            res.send(response.body);
        } else if (error) {
            console.log("error: " + error);
            res.send("failed to call function app" + error);
        }
    });
});

var functionurl2 = "https://function-app-v2b.azurewebsites.net/api/RHG-PWA-HttpTrigger1?code=b9R1WbV2ME8ly1YaAd8dUqQ6AwVveJfFuT2Fzr0El2pfhbcgIhQeIQ==";
var datas = '';
router.get('/postfunctionmongodb', function (req, res) {
    request({
        url: functionurl2,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {}
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("success");
            datas = response.body.res;
            console.log(datas);
            // res.send(datas);
            res.render('MongoData', {
                mongoData: datas
            });

        } else if (error) {
            console.log("error: " + error);
            res.send("failed to call function app" + error);
        }
    });
});

module.exports = router;