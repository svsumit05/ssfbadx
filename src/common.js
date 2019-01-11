function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// self invoking function
(function () {
    /*
    $(this).bind("contextmenu", function(e) {
        e.preventDefault();
    });
    
    setInterval(function(){ if(!navigator.onLine) {
       alert('There seems to be an netwrok issue, Please try again later.')     
    }}, 15000);    
    */
})();

window.oncontextmenu = function () {
    // return false;
}

$(document).keydown(function (event) {
    /*
    if (event.keyCode == 123) {
        return false;
    }
    else if ((event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74)) {
        return false;
    }
    */
})

$(document).on('click', '#btnFullscreen', function () {
    toggleFullscreen();
});
