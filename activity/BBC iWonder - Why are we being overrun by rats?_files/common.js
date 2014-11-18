define(function(require) {

    function getPlaypenHost(sendSandboxToTest) {
        var thisUrl = require.toUrl('./common.js');
        var thisEnvMatch = /(\.int|\.test|\.stage|\.dev|)\.bbc/g.exec(thisUrl); // final '|' matches '' for live
        var thisEnv = thisEnvMatch ? thisEnvMatch[1] : ".dev";
        var hostForSandbox = (sendSandboxToTest 
            ? "http://play.test.bbc.co.uk" 
            : "http://pal.sandbox.dev.bbc.co.uk");
        return (thisEnv === ".dev"
            ? hostForSandbox
            : "http://play" + thisEnv + ".bbc.co.uk");
    }

    function addListener(element, eventName, callback) {
        if (window.addEventListener) {
            element.addEventListener(eventName, callback, false);
        }
        else {
            element.attachEvent("on" + eventName, callback); //IE8
        }
    }

    return {
        getPlaypenHost: getPlaypenHost,
        addListener: addListener
    };
});