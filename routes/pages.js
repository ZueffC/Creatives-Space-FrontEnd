const axios = require('axios');

function mainPage(req, res, baseUrl){
    axios.get(baseUrl).then((response) => {
        res.render("index", {videos: response.data, title: "Главная", baseUrl: baseUrl});
    });
}

function profilePage(req, res, baseUrl){
    let userId = req.session.userId;

    if (userId){
        axios.get(baseUrl + `getUser/${userId}`)
            .then(responseUser => {
                axios.get(baseUrl + `getAllUserVideos/${userId}`)
                    .then(responseVideos => {
                        console.log(responseUser.data)
                        res.render("profile",
                            {
                                data: responseUser.data,
                                videos: responseVideos.data || null,
                                baseUrl: baseUrl, title: "Профиль " + responseUser.data.User.nick,
                                profile: true
                            }
                        );
                    });
            });
    } else {
        res.redirect('/login');
    }
}

function videoPage(req, res, baseUrl){
    if (req.params.videoId){
        let comments;

        axios.get(baseUrl + `getComments/${req.params.videoId}`).then(function(data){  comments = data.data });
        axios.get(baseUrl + `getVideo/${req.params.videoId}`).then(function (response) {
            axios.get(baseUrl + `getUser/${response.data.Video.UserId}`).then(function(userData) {
                res.render("video", {video: response.data, author: userData.data, baseUrl: baseUrl, title: response.data.Video.Name, comments: comments});
            });
        });
    } else {
        res.redirect("/");
    }
}

function sendEmotion(req, res, baseUrl){
    if(req.session.userId){
        let videoId = parseInt(req.body.videoId, 10);
        let emotion = parseInt(req.body.emotion, 10);
        let userId = parseInt(req.session.userId, 10);
        
        axios.post(baseUrl + "add-emotion", {videoId: videoId, emotion: emotion, userId: userId});
    } else {
        res.send("go_to_login")
    }
}

function sendComment(req, res, baseUrl){
    if(req.session.userId){
        let comment = req.body.comment;
        let userId  = parseInt(req.session.userId, 10);
        let videoId = parseInt(req.body.videoId, 10);

        axios.post(baseUrl + "add-comment", {comment: comment, userId: userId, videoId: videoId});
    } else {
        res.send("go_to_login")
    }
}

function seeUser(req, res, baseUrl){
    let userId = req.params.id;
    let sessionId = req.session.userId;

    if (userId != null && userId > 0){
        if (userId == sessionId){
            res.redirect("/profile");
        } else {
            axios.get(baseUrl + `getUser/${userId}`).then(responseUser => {
                axios.get(baseUrl + `getAllUserVideos/${userId}`).then(responseVideos => {
                    res.render("profile", {data: responseUser.data, videos: responseVideos.data || null, baseUrl: baseUrl, title: "Профиль " + responseUser.data.User.Nick});
                });
            });
        }
    } else {
        res.redirect("/");
    }
}

module.exports = {
    name: "Pages",
    mainPage: mainPage,
    profilePage: profilePage,
    videoPage: videoPage,
    sendEmotion: sendEmotion,
    sendComment: sendComment,
    seeUser: seeUser,
}