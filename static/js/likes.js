function addEmotion(likeOrDislike, videoId){ //like wil be one and dislike zero
    $.ajax({
        type: "POST",
        url: "/add-emotion",
        data: {videoId: videoId, emotion: likeOrDislike},
        success: function(text){
            if(text == "go_to_login"){
                window.location.href = "/login"
            } else {
                console.log(text);
            }
        },
    });

    if (likeOrDislike === 1){
        let likes = document.querySelector("#like");
        let likesCount = parseFloat(likes.innerText);
        likes.innerText = likesCount + 1;
    } else{
        let disLikes = document.querySelector("#dislike");
        let disLikesCount = parseFloat(disLikes.innerText);
        disLikes.innerText = disLikesCount + 1;
    }
}