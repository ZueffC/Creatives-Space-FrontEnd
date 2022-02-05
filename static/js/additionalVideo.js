let videoElement = document.querySelector('#video');

//Key Pressed Listener that helps users work with video more efficiently and more reliable or useful
addEventListener("keypress", function(event) {
    if (event.code === "KeyP"){
        event.preventDefault();
        if (videoElement.paused)
            videoElement.play();
        else
            videoElement.pause();
    } else if(event.code === "KeyF"){
        if (document.fullscreenElement === null)
            videoElement.requestFullscreen() || videoElement.webkitEnterFullScreen()
        else
            document.exitFullscreen() || videoElement.webkitExitFullScreen()
    } else if(event.code === "KeyM"){
        if (videoElement.volume > 0.0)
            videoElement.volume = 0.0;
        else
            videoElement.volume = 1.0;
    }
});

//Key Down Listener that provides to change current video time onto frontend
addEventListener('keydown', function(event) {
    if(event.code === "ArrowLeft")
        videoElement.currentTime = videoElement.currentTime - 5;
    else if(event.code === "ArrowRight")
        videoElement.currentTime = videoElement.currentTime + 5;
});


//Mouse-clicked events provides us methods to play/pause or open video to full screen
videoElement.addEventListener("click", (event) => {
    if (videoElement.paused)
        videoElement.play();
    else
        videoElement.pause();
});

videoElement.addEventListener("dblclick", (event) => {
    if (document.fullscreenElement === null)
        videoElement.requestFullscreen() || videoElement.webkitEnterFullScreen();
    else
        document.exitFullscreen() || videoElement.webkitExitFullScreen();
});

