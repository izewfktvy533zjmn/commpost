(async function() {
    var url = 'https://commpost.on-going.jp/api/v1/healthz';
    var method = 'GET';
    var document_uri = document.documentURI;
    var article_id = await digestMessage(document_uri);

    timeout(3000, fetch(url, {
        method
    })).then(function(data) {
        return data.json();
    }).then(function (json) {
        if (json['status'] == "ok") {
            var promise = getComment(article_id);
            
            promise.then(function(json) {
                var commpost_comments = document.createElement('ul');
                commpost_comments.id = 'commpost-comments';

                commpost = document.getElementById('commpost');
                commpost.appendChild(commpost_comments);

                showComment(json);

                var commpost_comment_poster_input = document.createElement('input');
                commpost_comment_poster_input.setAttribute('id', 'commpost-comment-poster-input');
                commpost_comment_poster_input.setAttribute('type', 'text');
                commpost_comment_poster_input.setAttribute('placeholder', 'Anonymous');

                var commpost_comment_poster_input_div = document.createElement('div');
                commpost_comment_poster_input_div.appendChild(commpost_comment_poster_input);


                var commpost_comment_content_textarea = document.createElement('textarea');
                commpost_comment_content_textarea.setAttribute('id', 'commpost-comment-content-textarea');

                var commpost_comment_content_textarea_div = document.createElement('div');
                commpost_comment_content_textarea_div.appendChild(commpost_comment_content_textarea);


                var commpost_comment_send_button = document.createElement('button');
                commpost_comment_send_button.setAttribute('id', 'commpost-comment-send-button');
                commpost_comment_send_button.setAttribute('type', 'button');
                commpost_comment_send_button.setAttribute('onclick', 'sendComment();');
                commpost_comment_send_button.textContent = "Send";

                var commpost_comment_send_button_div = document.createElement('div');
                commpost_comment_send_button_div.appendChild(commpost_comment_send_button);


                var commpost_comment_post_form = document.createElement('form');
                commpost_comment_post_form.setAttribute('id', 'commpost-comment-post-form');
                commpost_comment_post_form.setAttribute('action', '#');
                commpost_comment_post_form.setAttribute('onsubmit', 'return false;');

                commpost_comment_post_form.appendChild(commpost_comment_poster_input_div);
                commpost_comment_post_form.appendChild(commpost_comment_content_textarea_div);
                commpost_comment_post_form.appendChild(commpost_comment_send_button_div);


                var commpost_comment_post_form_div = document.createElement('div');
                commpost_comment_post_form_div.setAttribute('id', 'commpost-comment-post-form')
                commpost_comment_post_form_div.appendChild(commpost_comment_post_form);

                commpost.appendChild(commpost_comment_post_form_div);
            });
        }
    }).catch(function(err) {
        target = document.getElementById('commpost');
        target.textContent = "Dosen't work";
    });

})();

function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error("timeout"));
        }, ms);
        promise.then(resolve, reject);
    });
}

async function digestMessage(message){
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

    return hashHex;
}

function showComment(json) {
    for (var i = 0; i < json.length; i++) {
        var date = json[i].date;  
        var poster_name = json[i].poster_name;
        var text = json[i].text;
        
        var commpost_comment_poster_b = document.createElement('b');
        commpost_comment_poster_b.setAttribute('class', 'commpost-comment-poster');
        commpost_comment_poster_b.textContent = poster_name;

        var commpost_comment_poster_div = document.createElement('div');
        commpost_comment_poster_div.setAttribute('class', 'commpost-comment-poster');
        commpost_comment_poster_div.appendChild(commpost_comment_poster_b);

        var commpost_comment_date_time = document.createElement('time');
        commpost_comment_date_time.setAttribute('datetime', date);
        commpost_comment_date_time.textContent = date;
        
        var commpost_comment_date_div = document.createElement('div');
        commpost_comment_date_div.setAttribute('class', 'commpost-comment-date');
        commpost_comment_date_div.appendChild(commpost_comment_date_time);

        var commpost_comment_content_p = document.createElement('p');
        commpost_comment_content_p.setAttribute('class', 'Commpost-comment-content');
        commpost_comment_content_p.textContent = text;
        
        var commpost_comment_content_div = document.createElement('div');
        commpost_comment_content_div.setAttribute('class', 'commpost-comment-content');
        commpost_comment_content_div.appendChild(commpost_comment_content_p);

        var article = document.createElement('article');
        article.appendChild(commpost_comment_poster_div);
        article.appendChild(commpost_comment_date_div);
        article.appendChild(commpost_comment_content_div);

        var comment = document.createElement('li');
        comment.id = "commpost-comment-" + json[i]._id;
        comment.appendChild(article);
        
        var commpost_comments = document.getElementById('commpost-comments');
        commpost_comments.appendChild(comment);
    }
}

function getComment(article_id) {
    var url = 'https://commpost.on-going.jp/api/v1/comments?article_id=' + article_id;
    var method = 'GET';

    return fetch(url, {
        method
    }).then(function(data) {
        return data.json();
    }).then(function (json) {
        return json;
    }).catch(function(err) {
        return {};
    });
}

async function sendComment() {
    var document_uri = document.documentURI;
    var article_id = await digestMessage(document_uri);
    var name = document.getElementById('commpost-comment-poster-input').value;
    var comment = document.getElementById('commpost-comment-content-textarea').value;
    if (name.length == 0) name = "Anonymous";
    if (comment.length == 0) return;

    var url = 'https://commpost.on-going.jp/api/v1/comments';
    var obj = {
        "article_id": article_id,
        "poster_name": name,
        "text": comment
    };
    var method = 'POST';
    var body = JSON.stringify(obj);
    var headers = {
      'Content-Type': 'application/json'
    };

    fetch(url, {
        method, 
        headers, 
        body
    }).then((data) => {
        return data.json()
    }).then((json) => {
        showComment([json]);
        document.forms['comment_form'].reset();
    }).catch((err) => {
        return {};
    });
}