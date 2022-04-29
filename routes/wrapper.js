const axios = require('axios');

async function searchAPI(req, res, baseUrl){
    let text = req.body.text;

    if(text.length > 0){
        axios.post(baseUrl + 'search', {title: text}).then((response) => {
            res.json(response.data);
        });
    }
}

async function deleteVideo(req, res, baseUrl){
    let video_id = parseInt(req.body.videoId);
    let user_id = parseInt(req.session.userId);

    if (video_id > 0 && user_id != null){
        axios.post(baseUrl + "delete-video", {video_id: video_id, user_id: user_id});
        await res.json({"result": "success"});
    } else {
        await res.json({"result": "error"});
    }
}

module.exports = {
    searchAPI: searchAPI,
    deleteVideo: deleteVideo,
}