const axios = require('axios');


async function sendEmotion(req, res, baseUrl){
    if(req.session.userId){
        let videoId = parseInt(req.body.videoId, 10);
        let emotion = parseInt(req.body.emotion, 10);
        let userId = parseInt(req.session.userId, 10);

        axios.post(baseUrl + "add-emotion", {videoId: videoId, emotion: emotion, userId: userId});
    } else {
        res.json({result: "go_to_login"})
    }
}

async function sendComment(req, res, baseUrl){
    if(req.session.userId){
        let comment = req.body.comment;
        let userId  = parseInt(req.session.userId, 10);
        let videoId = parseInt(req.body.videoId, 10);

        axios.post(baseUrl + "add-comment", {comment: comment, userId: userId, videoId: videoId});
    } else {
        res.send("go_to_login")
    }
}

module.exports = {
    sendEmotion: sendEmotion,
    sendComment: sendComment,
}