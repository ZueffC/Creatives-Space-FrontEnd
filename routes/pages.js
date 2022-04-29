const axios = require('axios');

async function mainPage(req, res, baseUrl){
    axios.get(baseUrl).then((response) => {
        res.render("index", {videos: response.data, title: "Главная", baseUrl: baseUrl});
    });
}

async function profilePage(req, res, baseUrl){
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
                                baseUrl: baseUrl, title: "Профиль " + responseUser.data.User.Nick,
                                profile: true
                            }
                        );
                    });
            });
    } else {
        res.redirect('/login');
    }
}

async function videoPage(req, res, baseUrl){
    if (req.params.videoId){
        let comments;

        axios.get(baseUrl + `getComments/${req.params.videoId}`)
            .then(function(data){
                if(data.data)
                    comments = data.data;
                else
                    res.redirect("/");
            });

        axios.get(baseUrl + `getVideo/${req.params.videoId}`).then(function (response) {
            if(response.data.Video != null){
                axios.get(baseUrl + `getUser/${response.data.Video.UserId}`).then(function(userData) {
                    res.render("video", {video: response.data, author: userData.data, baseUrl: baseUrl, title: response.data.Video.Name, comments: comments});
                });
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
}

async function anotherUserPage(req, res, baseUrl){
    let userId = req.params.id;
    let sessionId = req.session.userId;

    if (userId != null && userId > 0){
        if (userId == sessionId){
            res.redirect("/profile");
        } else {
            axios.get(baseUrl + `getUser/${userId}`).then(responseUser => {
                if (responseUser.data.User != null){
                    axios.get(baseUrl + `getAllUserVideos/${userId}`).then(responseVideos => {
                        res.render("profile", {data: responseUser.data, videos: responseVideos.data || null, baseUrl: baseUrl, title: "Профиль " + responseUser.data.User.Nick});
                    });
                } else {
                    res.redirect("/");
                }
            });
        }
    } else {
        res.redirect("/");
    }
}

async function likedVideosPage(req, res, baseUrl){
    let userId = req.session.userId;

    if (userId != null && userId > 0){
        axios.post(baseUrl + "liked-videos", {userId: parseInt(userId, 10)}).then(reponseVideos => {
            res.render("liked-videos", {videos: reponseVideos.data, baseUrl: baseUrl});
        });
    } else {
        res.redirect("/login");
    }
}

async function searchPage(req, res, baseUrl){
    let text = (req.body.text).trim();

    if (text) {
        axios.post(baseUrl + 'search', {title: text}).then((response) => {
            res.render("search", {search: response.data, baseUrl: baseUrl});
        });
    } else {
        res.redirect("/");
    }
}



module.exports = {
    name: "Pages",
    searchPage: searchPage,
    likedVideosPage: likedVideosPage,
    mainPage: mainPage,
    profilePage: profilePage,
    videoPage: videoPage,
    anotherUserPage: anotherUserPage,
}