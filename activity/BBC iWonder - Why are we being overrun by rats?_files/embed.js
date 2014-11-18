define(function(require) {
    "use strict";

    // embed(gid, options)
    // ... where options may omitted or be {frameContainerId: <css id of container div>, forceSize: ['full_screen'|'in_page']}
    // ... with option fields optional.

    var common = require("./common");

    var apiListenerAttached = false;

    function embed(gid, options) {
        var containerId = options && options.frameContainerId || "og-frame-holder";
        var forceSize = options && options.forceSize;
        // For testing, primarily:
        var playpenBase = options && options.playpenBase; // if omitted: same host as this script is served from.
        hasTouchScreen = (options && options.funcDetectTouchScreen) || hasTouchScreen;

        var exitGameUrl = options && options.exitGameUrl;
        var queryString = options && options.queryString;

        var url = playpenUrl(playpenBase, gid, exitGameUrl, queryString);

        if (shouldShowFullscreen(forceSize)) {
            navigateTo(url);
        }
        else {
            createIframe(url, containerId);
        }
    }

    function navigateTo(url) {
        window.top.location.href = url;
    }

    function createIframe(src, containerId, forceSize) {
        var container = document.getElementById(containerId);
        removeChildren(container);

        var skipToId = 'afterICE';
        var skipLink = createSkipLink(container, skipToId);

        var afterICE = document.createElement('a');
        afterICE.id = skipToId;
        afterICE.tabIndex =  0;

        var iframe = document.createElement("iframe");
        iframe.src = src;

        var style = iframe.style;
        style.width = "100%";
        style.height = "0";
        style.display = "block"; // to centre with margin:auto, below
        style.margin = "0 auto";
        style.border = "none";

        container.appendChild(iframe);
        container.appendChild(afterICE);

        listenForOgApiMessages(src);
    }
    
    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function createSkipLink(container, skipToId) {
        var skipLink = document.createElement("a");
        skipLink.href = '#afterICE';
        skipLink.innerHTML = 'Skip interactive content';

        var style = skipLink.style;

        style.fontWeight = 'bold'; 
        style.fontSize = '0.9em';
        style.fontFamily = 'arial';
        style.color = 'black';
        style.textDecoration = 'none';
        style.outline = 0;
        style.position = 'fixed';
        style.top = '-9999px';
        style.left = '100px';
        style.zIndex = 1000000;
        style.color = '#000000';
        style.borderStyle = 'solid';
        style.borderWidth = '1px';
        style.borderColor = '#CCC';
        style.padding = '8px 8px';

        common.addListener(skipLink, "focus", function() {
            style.top = '100px';
        });
        common.addListener(skipLink, "blur", function() {
            style.top = '-9999px';
        });

        skipLink.onkeydown = function(event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === 13 || keyCode === 32) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                document.getElementById(skipToId).focus();
            }
        };

        container.appendChild(skipLink);
    }

    function listenForOgApiMessages(gameSrc) {
        if (!apiListenerAttached) {
            common.addListener(window, "message", function(event) {
                var argv = event.data.split("|");

                switch (argv[0]) {
                    case "og.goFullScreen":
                        navigateTo(event.source.location.href);
                        break;
                    case "og.resizeFrame":
                        resizeFrame(findIframeInDomFromEventSource(event.source), argv[1], argv[2]);
                        break;
                    default:
                        console.log("unexpected message", argv);
                        break;
                }
            });

            apiListenerAttached = true;
        }
    }

    function findIframeInDomFromEventSource(eventSource) {
        var iframes = document.querySelectorAll("iframe");
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === eventSource) {
                return iframes[i];
            }
        }
    }

    function resizeFrame(iframe, width, height) {
        if (width) {
            iframe.style.width = width + "px";
        }
        if (height) {
            iframe.parentNode.style.height = height + "px";
            iframe.style.height = height + "px";
        }
    }

    function startsWith(prefix, string) {
        return string.indexOf(prefix) === 0;
    }

    function playpenUrl(playpenBase, gid, exitGameUrl, queryString) {
        if (!playpenBase) {
            var host = common.getPlaypenHost();
            playpenBase = host + (host.indexOf(".sandbox.") > 0 ? "/playpen/" : "/play/pen/");
        }

        var playpenUrl = playpenBase + gid;
       
        playpenUrl = appendExitGameUrl(playpenUrl, exitGameUrl);
        playpenUrl = appendQueryString(playpenUrl, queryString);

        return playpenUrl;
    }

    function appendExitGameUrl(playpenUrl, exitGameUrl) {
        if (exitGameUrl) {            
            playpenUrl = playpenUrl + '?exitGameUrl=' + encodeURIComponent(exitGameUrl);
        }

        return playpenUrl;
    }

    function appendQueryString(playpenUrl, queryString) {   
        if (queryString) {
            if (playpenUrl.indexOf("?") > -1) {
                queryString = queryString.replace("?", "&");
            }

            playpenUrl = playpenUrl + queryString;
        }

        return playpenUrl;
    }

    function shouldShowFullscreen(forceSize) {
        if (forceSize === "full_screen") return true;
        if (forceSize === "in_page") return false;
        return hasTouchScreen() || isSmallScreen();
    }

    function hasTouchScreen() {
        if ('msMaxTouchPoints' in window.navigator) {
            return window.navigator.msMaxTouchPoints > 0;
        }
        else {
            return ('ontouchstart' in window) || ('onmsgesturechange' in window);
        }
    }

    function isSmallScreen() {
        // This calculation is currently intentionally crude.
        var largeScreenThresh = 720 + 440;
        return (screen.width + screen.height) < largeScreenThresh;
    }

    return embed;
});