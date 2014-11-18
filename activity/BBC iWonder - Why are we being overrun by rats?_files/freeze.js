define(function(require) {
    "use strict";
    
    var embed = require("./embed");
    var common = require("./common");

    function freeze(gid, options) {
        var launcherImagePid = options && options.overrideLauncherImagePid;
        
        var containerId = options && options.frameContainerId || "og-frame-holder";
        var launcherColours = options && options.launcherColours || {};
        var optDims = options && options.launcherDimensions || {};
        
        var container = document.getElementById(containerId);
        var freezeElement = createLauncherElement(containerId, launcherColours);
        setSizes(container, freezeElement, optDims, launcherImagePid);

        container.appendChild(freezeElement);
        
        common.addListener(freezeElement, 'click', function() {
            embed(gid, options);
        });

        common.addListener(window, 'resize', function() {
            setSizes(container, freezeElement, optDims, launcherImagePid);
        });
        
        if (!launcherImagePid) {
            requestPidForGid(gid, function(gamesDbPid) {
                if (gamesDbPid) {
                    setSizes(container, freezeElement, optDims, gamesDbPid);
                }
            });
        }
    }
    
    function requestPidForGid(gid, onCompleteFunc) {
        if (window.XDomainRequest) {
            var request = new XDomainRequest();
            request.onload = function() {
                var gameData = JSON.parse(request.responseText);
                onCompleteFunc(gameData.hero_image_pid);
            };
        }
        else {
            var request = new XMLHttpRequest();
            request.onreadystatechange=function() {
                if (request.readyState==4 && request.status==200) {
                    var gameData = JSON.parse(request.responseText);
                    onCompleteFunc(gameData.hero_image_pid);
                }
            }
        }
        request.open("GET", common.getPlaypenHost(true) + "/play/api/v1/games/" + gid, true);
        request.send();
    }
    
    function setSizes(container, freezeElement, optDims, imagePid) {
        var width = optDims.width || container.offsetWidth;
        var height = optDims.height || (width * 9 / 16);
        container.style.height = height + "px";
        freezeElement.style.width = width + "px";
        freezeElement.style.height = height + "px";
        
        if (imagePid) {
            var imageUrl = optimalImageUrl(width, height, imagePid);
            freezeElement.style.backgroundImage = "url("+imageUrl+")";
            // For IE8:
            freezeElement.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+imageUrl+"',sizingMethod='scale')\"";
        }
    }
    
    function optimalImageUrl(width, height, imagePid) {
        var preferredWidths = [400, 512, 608, 704, 800];
        var n = preferredWidths.length;
        var bestWidth = preferredWidths[n-1];
        for (var i=0; i<n; ++i) {
            if (preferredWidths[i] >= width) {
                bestWidth = preferredWidths[i];
                break;
            }
        }
        var bestHeight = Math.round(bestWidth * 9 / 16);
        return "http://ichef.bbci.co.uk/images/ic/"+bestWidth+"x"+bestHeight+"/"+imagePid+".jpg";
    }
    
    function createLauncherElement(containerId, launcherColours) {
        var button = document.createElement("button");
        var icon = document.createElement("div");
        button.appendChild(icon);
        
        var selector = '#' + containerId;
        var iconUrl = require.toUrl("./playicon.png");
        var colours = {
            base: launcherColours.base || "black",
            hover: launcherColours.hover || "dimgray",
            active: launcherColours.active || "silver"
        };
        
        addStyleSheet(
            selector + " button {"
            +   "border:none; margin:0; padding:0; position:relative; "
            +   "overflow: visible; " // required on IE so that play icon div doesn't disappear.
            +   "background-color: black; "
            +   "background-size: 100% 100%;"
            +   "font-size: x-large; "
            +   "cursor: pointer; "
            + "}"
            + selector + " button div { "
            +   "width:80px; height:80px; "
            +   "position:absolute; bottom:0; left:0; border:none; "
            +   "background-image: url(" + iconUrl + "); "
            +   "background-position: center center; "
            +   "background-repeat:no-repeat; " 
            +   "background-color:" + colours.base + "; "
            + "} "
            + selector + " button:hover div { background-color:" + colours.hover + "} "
            + selector + " button:focus div { background-color:" + colours.hover + "} "
            + selector + " button:active div { background-color:" + colours.active + "} "
        );

        return button;
    }
    
    function addStyleSheet(cssText) {
        if ('createStyleSheet' in document) {
            // ie8
            var style = document.createStyleSheet();
            style.cssText = cssText;
        }
        else {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(cssText));
            document.head.appendChild(style);
        }
    }

    return freeze;
});