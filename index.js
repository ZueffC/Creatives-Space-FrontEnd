"use strict";

const port = process.env.PORT || 3333;

const Settings = require('./routes/settings');
const Uploads = require('./routes/uploads');
const Pages = require('./routes/pages');
const Auth = require('./routes/auth');

const cookieParser = require("cookie-parser");
const sitemap = require('express-sitemap')();
const compression = require('compression');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const Eta = require("eta");
const app = express();

let baseUrl = "https://vi-space-api.herokuapp.com/api/v1/"; //On localhost
//let baseUrl = "https://titruba-api.herokuapp.com/api/v1/"; //On production
let authUrl = "http://f0615495.xsph.ru/api/v1/";

Eta.configure({
    filter: function (val) {
        return (val === undefined || val === null)? "": val
    }
})

app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use('/static', express.static('static', { maxAge: 31557600 }));
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24},
    resave: false,
}));

app.engine("eta", Eta.renderFile);
app.set("view engine", "eta");
app.set("views", "./views");
app.use(cors());

//We access userId to all templates from session
app.use(function(req,res,next){
    res.locals.userId = req.session.userId || null;
    res.locals.nick   = req.session.Nick || null;
    res.locals.avatar = req.session.Avatar || null;
    res.baseUrl = baseUrl;

    res.locals.siteName = "V-Space";
    next();
});

app.get('/', (req, res) => { Pages.mainPage(req, res, baseUrl) });
app.get('/wait', (req, res) => { res.render("wait") });
app.get('/sitemap.xml', (req, res) => { sitemap.XMLtoWeb(res);})
app.get('/profile', (req, res) => { Pages.profilePage(req, res, baseUrl) });
app.get('/user/:id', (req, res) => { Pages.seeUser(req, res, baseUrl) });

app.get('/login', (req, res) => { Auth.loginGet(req, res, authUrl) });
app.get('/register', (req, res) => { Auth.registerGet(req, res, authUrl) });
app.post('/login', (req, res) => { Auth.loginPost(req, res, authUrl, baseUrl) });
app.post('/register', (req, res) => { Auth.registerPost(req, res, authUrl) });
app.get('/logout', (req, res) => { req.session.userId = null; res.redirect('/'); });

app.get('/upload-video', (req, res) => { Uploads.getVideUploadPage(req, res, baseUrl); });

app.get('/change-information', (req, res) => { Settings.settingsPage(req, res, baseUrl) });
app.post('/change-information', (req, res) => { Settings.changeMainInformation(req, res, baseUrl) });
app.post('/change-password', (req, res) => { Settings.changeUserPassword(req, res, baseUrl) });

app.get('/video/:videoId', (req, res) => { Pages.videoPage(req, res, baseUrl) });
app.post('/add-emotion', (req, res) => { Pages.sendEmotion(req, res, baseUrl) });
app.post('/add-comment', (req, res) => { Pages.sendComment(req, res, baseUrl) });


sitemap.generate4(app);
sitemap.XMLtoFile();

app.listen(port, () => { console.log(`Server listening on port ${port}`) });
