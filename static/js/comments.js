function addComment(videoId){
    let comment = document.querySelector("#comment").value.trim();

    if (comment.length > 2 && videoId != null && videoId > 0) {
        $.ajax({
            type: "POST",
            url: "/add-comment",
            data: {comment: comment, videoId: videoId},
            success: function(text){
                if(text == "go_to_login"){
                    window.location.href = "/login"
                }
            },
        });
        
        addCommentOnFrontEnd(comment);
    }
}

function addCommentOnFrontEnd(text){
    let blockOfComents = document.querySelector("#newComment");
    blockOfComents.innerHTML += `
         <div class="skill-box">
             <div class="header bg-white fg-black mt-3">
                <div class="subtitle">${text}</div>
             </div>
         </div>    
    `;
}
