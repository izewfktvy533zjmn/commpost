window.addEventListener('DOMContentLoaded', async function() {
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
                target = document.getElementById('commpost');
                target.innerHTML = 'Commpost<br><table id="display_comment"></table> <form id="comment_form" action="#" onsubmit="return false;"> <p>Name: <br> <input type="text" id="input_name" placeholder="Anonymous"> </p> <p>Comment: <br> <textarea id="input_comment"></textarea> </p> <button type="button" onclick="sendComment();">Send</button> </form>';
                showComment(json);

            });
        }
    }).catch(function(err) {
        target = document.getElementById('commpost');
        target.innerHTML = "Dosen't work";
        console.log("commpost.on-going.jp doesn't work.");
    });

});

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
        var row = document.getElementById('display_comment').insertRow();

        row.insertCell().textContent = date;
        row.insertCell().textContent = poster_name;
        row.insertCell().textContent = text;
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
        console.log("commpost.on-going.jp doesn't work.");
        return {};
    });
}

async function sendComment() {
    var document_uri = document.documentURI;
    var article_id = await digestMessage(document_uri);
    var name = document.getElementById("input_name").value;
    var comment = document.getElementById("input_comment").value;
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
        console.log("commpost.on-going.jp doesn't work.");
    });
}
