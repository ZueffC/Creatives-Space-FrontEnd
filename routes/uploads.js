const axios = require("axios");

function getVideUploadPage(req, res, baseUrl){
    let id  = req.session.userId;

    if(id){
        res.render("uploadVideo", {baseUrl: baseUrl, title: "Загрузка видео"});
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    getVideUploadPage: getVideUploadPage,
}