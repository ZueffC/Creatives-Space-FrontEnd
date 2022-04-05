const axios = require('axios');
const sha256 = require('sha256');


function loginGet(req, res, authUrl) {
    res.render("login", {baseUrl: authUrl, title: "Вход"});
}

function registerGet(req, res, authUrl) {
    res.render("registration", {baseUrl: authUrl, title: "Регистрация"});
}


function loginPost(req, res, authUrl, baseUrl) {
    if(req.body.password.length > 2) {
        let nick = req.body.nick || "n";
        let email = req.body.email || "n";
        let frst_password = sha256(req.body.password);
        let password = sha256(frst_password);

        axios.post(authUrl + `login`, {nick: nick, email: email, password})
            .then(response => {
                if (response.data) {
                    axios.get(baseUrl + `getAvatar/${response.data.Id}`)
                        .then(resp => {
                            req.session.Avatar = resp.data || "https://miro.medium.com/max/1200/0*AqFiJp2_TrUgDtKN.png";
                            req.session.userId = response.data.Id;
                            req.session.Nick = response.data.Nick;

                            res.redirect("/profile");
                        });
                } else {
                    res.redirect("/login");
                }
            });
    } else {
        res.redirect('/login');
    }
}

function registerPost(req, res, authUrl) {
    if (req.body.password.length > 2) {
        let nick = req.body.nick || "n";
        let email = req.body.email || "n";
        let frst_password = sha256(req.body.password);
        let password = sha256(frst_password);

        axios.post(authUrl + `registration`, {nick: nick, email: email, password: password})
            .then(response => {
                if (response.data.Comment == "user was created successfully"){
                    res.redirect('/login');
                } else {
                    res.redirect('/register');
                }
            });
    } else {
        res.redirect('/register');
    }
}


module.exports = {
    name: "Auth",
    loginGet: loginGet,
    registerGet: registerGet,

    loginPost: loginPost,
    registerPost: registerPost,
}
