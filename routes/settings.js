const sha256 = require('sha256');
const axios = require('axios');

function settingsPage(req, res, baseUrl){
    let id = req.session.userId;
   
    if (id) {
        axios.get(baseUrl + `getUser/${id}`).then(response => {
            res.render("settings", {data: response.data, baseUrl: baseUrl});
        });
    } else {
        res.redirect("/login");
    }

}

function changeMainInformation(req, res, baseUrl){
    let id = parseInt(req.session.userId, 10);

    let nick = req.body.nick;
    let email = req.body.email;
    let about = (req.body.about).trim();

    if(id != null){
        axios.post(baseUrl + "change-information", {nick: nick, id: id, email: email, about: about, baseUrl: baseUrl})
            .then(response => {
                if(response.data.Status === 200){
                    res.redirect("/profile");
                } else {
                    res.redirect("/wait");
                }
            });
    } else {
        res.redirect("/");
    }
}

function changeUserPassword(req, res, baseUrl){
    let newPass = sha256.x2(req.body.newPass);
    let oldPass = sha256.x2(req.body.oldPass);

    axios.post(baseUrl + "change-password", {id: req.session.userId, newPass: newPass, oldPass: oldPass})
        .then(response => {
            if(response.data.Status === 200){
                res.redirect("/profile")
            } else {
                res.redirect("/change-information")
            }
        });
}

module.exports = {
    settingsPage: settingsPage,
    changeMainInformation: changeMainInformation,
    changeUserPassword: changeUserPassword,
}
