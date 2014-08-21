// Mechanism to pull in additional CSS or JavaScript files

// Textual.include_js("jquery.min.js");
// Textual.include_css("more_theme.css");


// Function called when new message from IRC has been posted to display

// Textual.newMessagePostedToDisplay = function(lineNumber)
// {
//		var newLine = document.getElementById("line" + lineNumber);
// }


// Functions called for contextual menus used within WebView
// DO NOT change without knowledge of what to do.
// Safe to remove from source code if not needed.

// Textual.on_url = function() { app.setUrl(event.target.innerHTML); }
// Textual.on_addr = function() { app.setAddr(event.target.innerHTML); }
// Textual.on_chname = function() { app.setChan(event.target.innerHTML); }
// Textual.on_ct_nick: function() { app.setNick(event.target.innerHTML); }
// Textual.on_nick = function() { app.setNick(event.target.parentNode.parentNode.getAttribute('nick')); }

var mappedSelectedUsers = new Array();

Textual.viewFinishedLoading = function() {
    Textual.fadeInLoadingScreen(1.00, 0.95);
    setTimeout(function() {
        Textual.scrollToBottomOfView()
    }, 500);
}

Textual.viewFinishedReload = function() {
    Textual.viewFinishedLoading();
}

Textual.newMessagePostedToView = function (line) {
    var element = document.getElementById("line-" + line);
    updateNicknameAssociatedWithNewMessage(element);
    emojify.run();

    var t = element.getAttribute("type");

    if (t == "join" || t == "part") {
        $(element).fadeOut(5000);
    }
}

Textual.nicknameSingleClicked = function() {
    userNicknameSingleClickEvent(event.target);
}

function updateNicknameAssociatedWithNewMessage(e) {
    /* We only want to target plain text messages. */
    var elementType = e.getAttribute("type");

    if (elementType == "privmsg" || elementType == "action") {
        /* Get the nickname information. */
        var senderSelector = e.querySelector(".sender");
        if (senderSelector) {
            /* Is this a mapped user? */
            var nickname = senderSelector.getAttribute("nick");

            /* If mapped, toggle status on for new message. */
            if (mappedSelectedUsers.indexOf(nickname) > -1) {
                toggleSelectionStatusForNicknameInsideElement(senderSelector);
            }
        }
        var prevnick = $(e).prev().children(".sender").attr("nick");
        var thisnick = $(e).children(".sender").attr("nick");
        if (prevnick == thisnick) {
            $(e).addClass("consecutive");
        }
    }
}

function toggleSelectionStatusForNicknameInsideElement(e) {
    /* e is nested as the .sender so we have to go three parents
     up in order to reach the parent div that owns it. */
    var parentSelector = e.parentNode.parentNode.parentNode;
    parentSelector.classList.toggle("selectedUser");
}

function userNicknameSingleClickEvent(e) {
    /* This is called when the .sender is clicked. */
    var nickname = e.getAttribute("nick");

    /* Toggle mapped status for nickname. */
    var mappedIndex = mappedSelectedUsers.indexOf(nickname);

    if (mappedIndex == -1) {
        mappedSelectedUsers.push(nickname);
    } else {
        mappedSelectedUsers.splice(mappedIndex, 1);
    }

    /* Gather basic information. */
    var documentBody = document.getElementById("body_home");
    var allLines = documentBody.querySelectorAll('div[type="privmsg"], div[type="action"]');

    /* Update all elements of the DOM matching conditions. */
    for (var i = 0, len = allLines.length; i < len; i++) {
        var sender = allLines[i].querySelectorAll(".sender");
        if (sender.length > 0) {
            if (sender[0].getAttribute("nick") === nickname) {
                toggleSelectionStatusForNicknameInsideElement(sender[0]);
            }
        }
    }
}
