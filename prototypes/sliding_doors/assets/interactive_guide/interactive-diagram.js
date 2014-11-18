;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("danmilon-object.keys-shim/index.js", function(exports, require, module){
// grabbed from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    var has            = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString')

    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ]

    var dontEnumsLength = dontEnums.length;
 
    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
        throw new TypeError('Object.keys called on non-object');
      }
 
      var result = [];
 
      for (var prop in obj) {
        if (has.call(obj, prop)) {
          result.push(prop);
        }
      }
 
      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnumsLength; i++) {
          if (has.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    }
  })()
}

module.exports = Object.keys

});
require.register("enyo-functionbind/index.js", function(exports, require, module){
// Source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind

if (!Function.prototype.bind) {

  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this, 
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis
                               ? this
                               : oThis,
                             aArgs.concat(Array.prototype.slice.call(arguments)));
      };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

});
require.register("gamtiq-object-create-shim/index.js", function(exports, require, module){
// Based on http://javascript.crockford.com/prototypal.html

if (! Object.create) {
    Object.create = function(proto) {
        function F() {}
        F.prototype = proto;
        return new F();
    };
}

module.exports = Object.create;

});
require.register("gamtiq-isarray-shim/index.js", function(exports, require, module){
// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray

if (! Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}

module.exports = Array.isArray;

});
require.register("gamtiq-array-indexof-shim/index.js", function(exports, require, module){
// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (!this) {
            throw (typeof TypeError === "function" ? new TypeError() : new Error("TypeError"));
        }
    
        var pivot = fromIndex || 0,
            length = this.length,
            i;
    
        if (length > 0 && pivot < length) {
            if (pivot < 0) {
                pivot = length - Math.abs(pivot);
            }
        
            for (i = pivot; i < length; i++) {
                if (this[i] === searchElement) {
                    return i;
                }
            }
        }
    
        return -1;
    };
}

module.exports = Array.prototype.indexOf;

});
require.register("gamtiq-es5-micro-shim/index.js", function(exports, require, module){
// Applies several ECMAScript 5 shims and composes exporting object that contains shim functions

require("functionbind");
require("array-indexof-shim");

module.exports = {
    "create": require("object-create-shim"),
    "isArray": require("isarray-shim"),
    "keys": require("object.keys-shim")
};

});
require.register("jb55-domready/index.js", function(exports, require, module){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loaded = /^loade|c/.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})
});
require.register("context-manager/index.js", function(exports, require, module){
/*
# CONTEXT MANAGER FOR INTERACTIVE PATTERNS..
Seeing as there is some functionality common to all patterns 
being tested, this global module aims to contain all of that 
functionality so it's not needlessly duplicated out across each 
iteration of each pattern.. (scroll-to-view, resize etc)

# HOW IT WORKS..
A reference to this module gets passed into each pattern on 
initialisation. The patterns then use the functions in here. 
Each module uses this to manage the following things:
* Start interaction/animation only when in view.. 
* Handle resizing of window for responsive cuttoffs (was using enquire.js which was great but not supported on IE9 unfortunately)..
* Determine if we're on a desktop vs a touch-enabled device..
*/
require('bind-poly');
require('events-poly');
var findOffset = require('find-offset');

//Array to store modules on current page....
var currentModules = new Array();
var moduleAdded = false;

//Array to store responsive screen-size cutoffs.. 
var responsiveSizes = new Array();
var currentResponsiveSize = 0;

//Rather than use the exact top and bottom of the module to check 'in view',
//this is a tolerance to move this area into the module itself (.4 = 40%)
var inViewScrollBuffer = 0.25; 

var initTimer = true;

// Responsive cut-off sizes..
responsiveSizes.push({min:0, max:598}); //Mobiles + smartphones.. (was max:599 - Nexus 7 fix..)
responsiveSizes.push({min:599, max:1007});//Tablets..  (was min:600 - Nexus 7 fix)
responsiveSizes.push({min:1008, max:10000});//Desktop..

// Get times and create vars to check resize/scroll changes.
// We have to create a situation that does stuff when the user has finished scrolling 
// (Because of the massively-annoying Apple issue where any animations stop, 
// then jump to the end, if the page scrolls)..


// So we're creating a timer and checking every XXX ms to see if the user 
// has finished scrolling.
var resizeTime = new Date(1, 1, 2000, 12,00,00);
var resizeTimeout = false;
var resizeDelta = 150;

var scrollTime = new Date(1, 1, 2000, 12,00,00);
var scrollTimeout = false;
var scrollDelta = 150;


module.exports = {

  // Setup takes in a pattern module (called from within each module) 
  // and attaches scroll and resize event handlers..
  setup: function(module, extraListener){
 
    currentModules.push(module);
    moduleAdded = true;
    
    // setup window event handlers                
    window.addEventListener('scroll', this._scrollEventHandler.bind(this));   
    window.addEventListener('resize', this._resizeEventHandler.bind(this));
    
    this._checkResponsiveSizes(this._getWindowSize()); // we need to call this immediately because otherwise when apps start they think
                                                   // they are the wrong responsive size/dont know their responsive size
    
    // Create a delayed initialisation for the current pattern 
    // because sometimes it fails to trigger without a user-scroll 
    // (but only sometimes - never got to the bottom of it so used this fix)
    window.setTimeout(this._delayedInit.bind(this), 500);

  },


  domready : require('domready'),

   //Check if we're on a touch device or not.. 
  //(Please see accompanying documentation for more info about this techinique
  //and whether or not it fits with the BBC's philosophy and approach)..
  touchDevice: function() {
    // none of those work
    var a = !!('ontouchstart' in window);
    var b = !!('msMaxTouchPoints' in window.navigator);

    var hasOrientation = !!('orientation' in window);


    return hasOrientation;    
  },

  // find out whether we can use svg
  isSVGSupported: function() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  },

  getResponsiveSize: function(){
    return currentResponsiveSize;
  },

  // private stuff

  //If the user has scrolled the window then stopped scrolling the window..
  _scrollEnd : function(){
    if (new Date() - scrollTime < scrollDelta) {
      setTimeout(this._scrollEnd.bind(this), scrollDelta);
    } else {
      scrollTimeout = false;
      this._checkModuleInView();
    }           
  },

  // handles the scroll event
  _scrollEventHandler : function(event) {
    initTimer = false;
    //This sets a timeout we can use to do resize functionality 
    // that doesn't fire on every single 'frame'..
    // Checks for user finishing a scroll.. 
    // (on mobile safari if a function is fired mid-scroll, 
    // it seems to pause everything then try to shift everything to 
    // its end state at the end of the scroll
    // - really annoying when things are supposed to be animating..)
    scrollTime = new Date();
    if(scrollTimeout === false) {
        scrollTimeout = true;
        setTimeout(this._scrollEnd.bind(this), scrollDelta);
    }     
  },


  // handles the resize event
  _resizeEventHandler : function(event) {
    //On resize call 'checkResponsiveSizes' 
    // (called every single 'frame' - but this is fine as we only fire 
    // a function when the window trips over a 'responsive' boundary)
    var width = this._getWindowSize();
    this._checkResponsiveSizes(width);
    
    //This sets a timeout we can use to do resize functionality 
    //that doesn't fire on every single 'frame'..
    //Checks for user finishing a resize..
    resizeTime = new Date();
    if(resizeTimeout === false) {
        resizeTimeout = true;
        setTimeout(this._resizeEnd.bind(this), resizeDelta);
    }
  },

  //If the user has resized the window then stopped resizing window..
  _resizeEnd : function(){
    if (new Date() - resizeTime < resizeDelta) {
      setTimeout(this._resizeEnd.bind(this), resizeDelta);
    } else {
      resizeTimeout = false;
      //Go through modules and call each ones 'resize' function.
      for(var n=0; n<currentModules.length; n++){
        currentModules[n].resized();
      }
    }           
  },


  // private methods
  // Check initial sizes and begin timeout.. 
  _delayedInit : function(){   
    // Check which responsive cut off we are within..
    this._checkResponsiveSizes(window.innerWidth);
    
    // initTimer gets set to false inside checkModuleInView and 
    // this gets called from 2 places. This funciton, and also 
    // the funciton that fires when the user stops scrolling.
    // Once we've checked if we're in view or not, this delayedInit 
    // never gets called again.
    // - Basically, once we're sure an init has taken place, 
    // stop this check and only use scroll check from now on.
    if(initTimer == true){
      this._checkModuleInView();

      this._resizeEnd();    
      window.setTimeout(this._delayedInit.bind(this), 500);
    }
  },

  //Called when user's scrolling about then they stop..
  _checkModuleInView : function(){
    initTimer = false;
    //Go through all modules..
    for(var n=0; n<currentModules.length; n++){
      var docViewTop = window.pageYOffset || 0; // in case we haven't scrolled
      var docViewBottom = docViewTop + Math.max(document.documentElement.clientHeight, window.innerHeight || 0);//$(window).height();

      var buffer;
      var elemTop; //For 'activate if in view' functionality..
      var elemBottom; //Ditto...

      var scrollTop;
      var scrollBottom;
      var imgHeight = 0


      //NOTE: we were caching these values but the imageArea is often responsive so we
      // should not cache that value as it produces incorrect results when the interactive
      // is resized

      if(!currentModules[n].gotModuleOffsets){      
        currentModules[n].gotModuleOffsets = true;
        currentModules[n].elemTop = findOffset(currentModules[n].imageArea).top;
      }

      imgHeight = currentModules[n].imageArea.clientHeight;
      currentModules[n].elemBottom = currentModules[n].elemTop + imgHeight;
      currentModules[n].elemHeight = imgHeight;  

      
      //Work out the 'buffer' zone. The top and bottom with zero buffer 
      //is the top and bottom of the pattern. The buffer brings these 
      //limits into the bounds of the pattern so we can make the pattern
      //not activate until it's coming into view by a certain amount 
      //(rather than as soon as the top or bottom cross the viewport limits)
      buffer = currentModules[n].elemHeight * inViewScrollBuffer;

      elemTop = currentModules[n].elemTop + buffer;
      elemBottom = currentModules[n].elemBottom - buffer;
    
      //Check if page's modules are in or out of view 
      //and call methods on each one based on this..
      if((elemBottom <= docViewBottom) && (elemTop >= docViewTop)){
        currentModules[n].inView();
      }else{
        currentModules[n].outOfView();
      }     
    }   
  },

  //When page has been resized we do this at the end 
  //to see if we've tripped over any of the responsive cutoffs 
  //(ie. went from tablet to desktop)
  _checkResponsiveSizes : function(w){
    
    //Go through responsiveSizes array..
    for(var i=0; i<responsiveSizes.length; i++){
      //Check current window width (w) against cut-offs in the array..
      if(w >= responsiveSizes[i].min && w < responsiveSizes[i].max){
        //If it's different from last iteration.. (or a new module has just been pushed into the array)..
        if(currentResponsiveSize != i || moduleAdded == true){
          //Call method on current modules to do something based on this..
          for(var n=0; n<currentModules.length; n++){
            currentModules[n].handleResponsiveChange(i);
          }                   
          //Store new index..
          currentResponsiveSize = i;
          moduleAdded = false;
          return
        }
      }
    }
    
  },

  _getWindowSize : function(){
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }



};

});
require.register("bind-poly/index.js", function(exports, require, module){
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
});
require.register("class-list-poly/index.js", function(exports, require, module){
/*global self, document, DOMException */
if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

(function (view) {

"use strict";

if (!('HTMLElement' in view) && !('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.className)
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.className = this.toString();
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    var index = checkTokenAndGetIndex(this, token);
    if (index !== -1) {
      this.splice(index, 1);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, forse) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      forse !== true && "remove"
    :
      forse !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  return !result;
};
classListProto.toString = function () {
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}
});
require.register("events-poly/index.js", function(exports, require, module){
(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();
});
require.register("find-offset/index.js", function(exports, require, module){
// Finds the offset position of an element
// very much like the jquery.offset() but
// you know, without jquery

// based on http://www.quirksmode.org/js/findpos.html


module.exports = function(element) {
  var offset = {
    top: 0,
    left: 0
  }
  // check if we support offsetParent
  if (element.offsetParent) {

    do {
      offset.top += element.offsetTop;
      offset.left += element.offsetLeft;
    } while (element = element.offsetParent);

  }
  
  return offset;

}
});
require.register("animation-frame/index.js", function(exports, require, module){
/**
 * An even better animation frame.
 *
 * @copyright Oleg Slobodskoi 2013
 * @website https://github.com/kof/animationFrame
 * @license MIT
 */

;(function(window) {
'use strict'

var nativeRequestAnimationFrame = top.requestAnimationFrame,
    nativeCancelAnimationFrame = top.cancelAnimationFrame || top.cancelRequestAnimationFrame

;(function() {
    var i,
        vendors = ['webkit', 'moz', 'ms', 'o']

    // Grab the native implementation.
    for (i = 0; i < vendors.length && !nativeRequestAnimationFrame; i++) {
        nativeRequestAnimationFrame = top[vendors[i] + 'RequestAnimationFrame']
        nativeCancelAnimationFrame = top[vendors[i] + 'CancelAnimationFrame'] ||
            top[vendors[i] + 'CancelRequestAnimationFrame']
    }

    // Test if native implementation works.
    // There are some issues on ios6
    // http://shitwebkitdoes.tumblr.com/post/47186945856/native-requestanimationframe-broken-on-ios-6
    // https://gist.github.com/KrofDrakula/5318048
    nativeRequestAnimationFrame && nativeRequestAnimationFrame(function() {
        AnimationFrame.hasNative = true
    })
}())

/**
 * Animation frame constructor.
 *
 * Options:
 *   - `useNative` use the native animation frame if possible, defaults to true
 *   - `frameRate` pass a custom frame rate
 *
 * @param {Object|Number} options
 */
function AnimationFrame(options) {
    if (!(this instanceof AnimationFrame)) return new AnimationFrame(options)
    options || (options = {})

    // Its a frame rate.
    if (typeof options == 'number') options = {frameRate: options}
    options.useNative != null || (options.useNative = true)
    this.options = options
    this.frameRate = options.frameRate || AnimationFrame.FRAME_RATE
    this._frameLength = 1000 / this.frameRate
    this._isCustomFrameRate = this.frameRate !== AnimationFrame.FRAME_RATE
    this._timeoutId = null
    this._callbacks = {}
    this._lastTickTime = 0
    this._tickCounter = 0
}

/**
 * Default frame rate used for shim implementation. Native implementation
 * will use the screen frame rate, but js have no way to detect it.
 *
 * If you know your target device, define it manually.
 *
 * @type {Number}
 * @api public
 */
AnimationFrame.FRAME_RATE = 60

/**
 * Replace the globally defined implementation or define it globally.
 *
 * @param {Object|Number} [options]
 * @api public
 */
AnimationFrame.shim = function(options) {
    var animationFrame = new AnimationFrame(options)

    window.requestAnimationFrame = function(callback) {
        return animationFrame.request(callback)
    }
    window.cancelAnimationFrame = function(id) {
        return animationFrame.cancel(id)
    }

    return animationFrame
}

/**
 * Crossplatform Date.now()
 *
 * @return {Number} time in ms
 * @api public
 */
AnimationFrame.now = Date.now || function() {
    return (new Date).getTime()
}

/**
 * Replacement for PerformanceTiming.navigationStart for the case when
 * performance.now is not implemented.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming.navigationStart
 *
 * @type {Number}
 * @api public
 */
AnimationFrame.navigationStart = AnimationFrame.now()

/**
 * Crossplatform performance.now()
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()
 *
 * @return {Number} relative time in ms
 * @api public
 */
AnimationFrame.perfNow = function() {
    if (window.performance && window.performance.now) return window.performance.now()
    return AnimationFrame.now() - AnimationFrame.navigationStart
}

/**
 * Is native animation frame implemented. The right value is set during feature
 * detection step.
 *
 * @type {Boolean}
 * @api public
 */
AnimationFrame.hasNative = false

/**
 * Request animation frame.
 * We will use the native RAF as soon as we know it does works.
 *
 * @param {Function} callback
 * @return {Number} timeout id or requested animation frame id
 * @api public
 */
AnimationFrame.prototype.request = function(callback) {
    var self = this,
        delay

    // Alawys inc counter to ensure it never has a conflict with the native counter.
    // After the feature test phase we don't know exactly which implementation has been used.
    // Therefore on #cancel we do it for both.
    ++this._tickCounter

    if (AnimationFrame.hasNative && self.options.useNative && !this._isCustomFrameRate) {
        return nativeRequestAnimationFrame(callback)
    }

    if (!callback) throw new TypeError('Not enough arguments')

    if (this._timeoutId == null) {
        // Much faster than Math.max
        // http://jsperf.com/math-max-vs-comparison/3
        // http://jsperf.com/date-now-vs-date-gettime/11
        delay = this._frameLength + this._lastTickTime - AnimationFrame.now()
        if (delay < 0) delay = 0

        this._timeoutId = window.setTimeout(function() {
            var id

            self._lastTickTime = AnimationFrame.now()
            self._timeoutId = null
            ++self._tickCounter

            for (id in self._callbacks) {
                if (self._callbacks[id]) {
                    if (AnimationFrame.hasNative && self.options.useNative) {
                        nativeRequestAnimationFrame(self._callbacks[id])
                    } else {
                        self._callbacks[id](AnimationFrame.perfNow())
                    }
                    delete self._callbacks[id]
                }
            }
        }, delay)
    }

    this._callbacks[this._tickCounter] = callback
    return this._tickCounter
}

/**
 * Cancel animation frame.
 *
 * @param {Number} timeout id or requested animation frame id
 *
 * @api public
 */
AnimationFrame.prototype.cancel = function(id) {
    if (AnimationFrame.hasNative && this.options.useNative) nativeCancelAnimationFrame(id)
    delete this._callbacks[id]
}


// Support commonjs wrapper, amd define and plain window.
if (typeof exports == 'object' && typeof module == 'object') {
    module.exports = AnimationFrame
} else if (typeof define == 'function' && define.amd) {
    define(function() { return AnimationFrame })
} else {
    window.AnimationFrame = AnimationFrame
}

}(window));

});
require.register("animator/index.js", function(exports, require, module){
// these animation methods are not meant to be incredibly full featured. All that is implemented here is all that is required
// for the 4 bbc interactives. animations of any SIMPLE css properties are possible. E.G, animating the shorthand 'border' property
// (1px solid #000) is not possible. Animating border-width and border-color properties individually is.
// there are also 'special cases' such as scale/matrix transforms that were required by one or more of the interactives and so have
// been added in too. If different animations end up being required it is possible that this mini-library will need to be extended


// the easing functions
var easingFunctions = {
    'linear':   function (t, b, c, d) {
                    return c * t / d + b;
                },
//animTime, fromValue, difference, this.duration
    'expoIn':   function easeInExpo( t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },

    'expoOut':  function easeOutExpo ( t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },

    'expoInOut': function( t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
}


var colourRegexes = {
    'fullHex' : /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    'shortHex' : /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
    'rgb' : /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/,
    'rgba' : /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)$/
}

var vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];

var propertiesRequiringPrefixes = ['transform'];

// return an array of the properties that need to be set.
function getProperties(property){
    if(propertiesRequiringPrefixes.indexOf(property) < 0){
        return [property]
    } else {
        // this property requires prefixing so return the prefixed versions of it
        var prefixedProperty = [];

        prefixedProperty.push(property);

        for(var i = 0, prefix; prefix = vendorPrefixes[i]; i++){
            prefixedProperty.push(prefix + property);
        }

        return prefixedProperty;
    }
}

// object of formatters for non-standard (i.e, not a simple '1px' etc value) property values
var propertyValueFormats = {
    'scale' : function(val){
        return 'matrix(' + val + ', 0, 0, ' + val + ', 0, 0)';
    }
}


var aliasLookup = {
    'scale' : 'transform'
}

// given a colour this will parse it in to an array of its 255 values
// grabbed from http://www.bitstorm.org/jquery/color-animation/jquery.animate-colors.js
function parseColours(colour){
    var colours;

    if (match = colourRegexes['fullHex'].exec(colour)) {
        colours = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

    } else if (match = colourRegexes['shortHex'].exec(colour)) {
        colours = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

        // Match rgb(n, n, n)
    } else if (match = colourRegexes['rgb'].exec(colour)) {
        colours = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];

    } else if (match = colourRegexes['rgba'].exec(colour)) {
        colours = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10),parseFloat(match[4])];

        // No browser returns rgb(n%, n%, n%), so little reason to support this format.
    } else {
        colours = [];
    }
    return colours;
}

function isColour(valueToCheck){

    var isColour = false;

    valueToCheck = ''+valueToCheck; //ensure string

    for(var key in colourRegexes){
        var reg = colourRegexes[key];

        if(valueToCheck.match(reg)){
            return true;
        }
    }

    return isColour;
}


function getUnit(value){
    var results =  /-?[0-9\.]+(.*)/.exec(value);
    if(results && results.length > 1){
        return results[1];
    } else {
        return '';
    }
}


// returns a function that wraps the supplied func ensuring it is only called once
// used for callbacks
function getOnceFunction(func){
    var executed = false;
    return function(){
        if(!executed){
            func();
            executed = true;
        }
    }
}


function configureOptions(options){
    options = options || {};

    //  ensure the onComplete callback can only be called once
    if(options.onComplete && typeof options.onComplete === 'function'){
        options.onComplete = getOnceFunction(options.onComplete);
    } else {
        options.onComplete = null;
    }

    return options;
}



// the animator app
function Animator(){
    this.animationFrameID; // the id of the requestAnimationFrame instance
    this.currentAnimations = []; // ongoing animations
    this.delayedAnimations = [];

}


Animator.prototype.animate = function(element, properties, duration, furtherOptions){
    // ensure we have the required parameters
    if(typeof element !== 'object' || typeof properties !== 'object' || typeof duration !== 'number'){
        return false;
    }

    furtherOptions = configureOptions(furtherOptions);

    // select the appropriate easing method
    var easingMethod = furtherOptions.easingMethod && furtherOptions.easingMethod || 'linear';

    

    // create animations for each of the properties that need animating
    for(var key in properties){
        if(properties.hasOwnProperty(key)){

            // the animation. non html elements are standard animations
            var animationClass = !(element instanceof HTMLElement) || !isColour(properties[key]) ? StandardAnimation : ColourAnimation;
            var animation = new animationClass(element, key, properties[key], duration, easingMethod, furtherOptions);

            // if it is delayed start a timeout to trigger it when we need it
            if(typeof furtherOptions.delay === 'number'){
                window.setTimeout(function(a){
                    // once the timeout is up we add the animation to the current animations list
                    this.currentAnimations.push(a);

                    // and if there arent currently animations occurring we trigger it to start up again
                    if(!this.animationFrameID){
                        this.animationFrameID = window.requestAnimationFrame(this.startAnimating.bind(this));
                    }
                    
                }.bind(this, animation), furtherOptions.delay);
            } else {
                // just add it straight to the current animations queue and it will be started immediately
                this.currentAnimations.push(animation);
            }
        }
    }

    if(!this.animationFrameID && this.currentAnimations.length > 0){
        // we need to start the animations
        this.animationFrameID = window.requestAnimationFrame(this.startAnimating.bind(this));
    }

}

Animator.prototype.startAnimating = function(time){
    if(this.currentAnimations.length > 0) {
        // we have animations to run so run them
        for(var i = 0, anim; anim = this.currentAnimations[i]; i++){
            if(anim.isFinished){
                // remove the animation from the current animations array if it is finished and move on
                this.currentAnimations.splice(i, 1);
                continue;
            }

            // perform a tick/frame
            anim.tick(time);
        }

        window.requestAnimationFrame(this.startAnimating.bind(this)); // set up for the next frame
    } else {
        // ensure we have stopped the animation frame from polling
        window.cancelAnimationFrame(this.animationFrameID);
        this.animationFrameID = null;
    }

}


Animator.prototype.scrollTo = function(elem, position, duration, furtherOptions){

    if(this.currentlyScrolling){
        return;
    }

    furtherOptions = configureOptions(furtherOptions);

    // we do this just to turn off the currently scrolling flag :/
    var onCompleteWrapper = function(cb){
        this.currentlyScrolling = false;
        cb && cb(); // run the actual callback if we have one
    }.bind(this, furtherOptions.onComplete);

    furtherOptions.onComplete = onCompleteWrapper;

    var animation = new ScrollAnimation(elem, position, duration, furtherOptions.easingMethod, furtherOptions);

    // if it is delayed start a timeout to trigger it when we need it
    if(furtherOptions && typeof furtherOptions.delay === 'number'){
        window.setTimeout(function(a){
            // once the timeout is up we add the animation to the current animations list
            this.currentAnimations.push(a);

            // and if there arent currently animations occurring we trigger it to start up again
            if(!this.animationFrameID){
                this.animationFrameID = window.requestAnimationFrame(this.startAnimating.bind(this));
            }
            
            this.currentlyScrolling = true;

        }.bind(this, animation), furtherOptions.delay);
    } else {
        // just add it straight to the current animations queue and it will be started immediately
        this.currentAnimations.push(animation);
        this.currentlyScrolling = true;
    }   
}

// given an element and a property/list of properties it will clear out any 
// set values and handle prefixes too
Animator.prototype.clearProperties = function(elem, props){

    var properties = [];

    // if the property is a string it is either one particular property or ALL properties
    if(props && typeof props === 'string'){
        if(props === 'all'){
            for(var propertyKey in elem.style){
                if(elem.style.hasOwnProperty(propertyKey)){
                    properties.push(propertyKey);
                }
            }
        } else {
            // ensure the property has all prefixes if required
            properties = getProperties(props);
        }
    } else if(props && props instanceof Array) {
        // get all the prefixed versions of all the supplied properties
        for(var i = 0, property; property = props[i]; i++){
            properties = properties.concat(getProperties(property));
        }
    }

    if(properties.length){

        for(var i = 0, propToClear; propToClear = properties[i]; i++){
            elem.style[propToClear] = '';
        }
    }
}




// an individual animation
function Animation(element, property, value, duration, easeMethod, furtherOptions){ }

Animation.prototype.initVariables = function(element, property, value, duration, easeMethod, furtherOptions){

    this.element = element;
    this.isHTMLElement = this.element instanceof HTMLElement;
    this.property = property;
    this.duration = duration;
    this.easeMethod = easeMethod;
    this.onComplete = furtherOptions && furtherOptions.onComplete;
    this.onUpdate = furtherOptions && furtherOptions.onUpdate;
    this.propertyFormatter = propertyValueFormats[property];

    this.isColourAnimation = false;
    
    this.isFinished = false;    
}

Animation.prototype.tick = function(currentTime){
    // add a start time if we dont have one
    if(!this.startTime){
        this.startTime = currentTime;
    }
    
    var animTime = currentTime - this.startTime, // How long has the animation been running?
        fromValue = this.startValue,
        toValue = this.endValue || 0,
        difference = toValue - fromValue;

    // Are we done?
    if (animTime >= this.duration) {
        // ensure that the ending location is the one we want
        // method 'update' does all the vendor prefix stuff. we need that only if its a htmlelement
        if(this.isHTMLElement) {
            this.update(toValue);
        } else {
            this.element[this.property] = toValue;
        }

        // call the callback if we have one
        if(typeof this.onComplete === 'function'){
            this.onComplete();
        }

        this.isFinished = true;
    }
    else {
        // animate the next frame
        var position = easingFunctions[this.easeMethod](animTime, fromValue, difference, this.duration);

        if(this.isHTMLElement) {
            this.update(position);
        } else {
            this.element[this.property] = position;
        }

        // call the onUpdate callback if provided
        if(typeof this.onUpdate === 'function'){
            this.onUpdate();
        }

        
    }

}

Animation.prototype.update = function(newValue){

    // add the appropriate properties
    var propertyName = aliasLookup[this.property] || this.property, // the property name. likely to be this.property but some properties have aliases. 
                                                                    // e.g, if a user supplies 'scale' that is an alias for a matrix transform
        properties = getProperties(propertyName); // the full list of prefixed properties

    for(var i = 0, property; property = properties[i]; i++){
        if(this.propertyFormatter){
            this.element.style[property] = this.propertyFormatter(newValue + this.endValueUnit);
        } else {
            this.element.style[property] = newValue + this.endValueUnit;
        }               
    }
}





function ColourAnimation(element, property, value, duration, easeMethod, furtherOptions){
    this.initVariables(element, property, value, duration, easeMethod, furtherOptions);

    var startValue = this.element.style[this.property];

    this.startValue = isColour(startValue) ?  parseColours(startValue) : parseColours('#fff'); // ensure we have a starting colour
    this.endValue = parseColours(value);
    this.isColourAnimation = true;
}

ColourAnimation.prototype = new Animation();
ColourAnimation.prototype.constructor = ColourAnimation;


ColourAnimation.prototype.tick = function(currentTime){
    if(!this.startTime){
        this.startTime = currentTime;
    }

    var animTime = currentTime - this.startTime;// How long has the animation been running?

    // Are we done?
    if (animTime >= this.duration) {
        // ensure that the ending location is the one we want
        this.element.style[this.property] = 'rgba(' + this.endValue[0] + ', ' + this.endValue[1] + ', ' + this.endValue[2] + ', ' + this.endValue[3] + ')';

        // call the callback if we have one
        if(typeof this.onComplete === 'function'){
            this.onComplete();
        }

        this.isFinished = true;
    }
    else {
        var newValues = [];

        for(var i = 0; i < 4; i++){

            var fromValue = this.startValue[i],
                toValue = this.endValue[i],
                difference = toValue - fromValue;


            newValues.push(Math.floor(easingFunctions[this.easeMethod](animTime, fromValue, difference, this.duration))); // floor the values so they are round and contain no decimals

        }

        this.element.style[this.property] = 'rgba(' + newValues[0] + ', ' + newValues[1] + ', ' + newValues[2] + ', ' + newValues[3] + ')';

        // the onUpdate callback..
        if(typeof this.onUpdate === 'function'){
            this.onUpdate();
        }       
    }
}



function ScrollAnimation(element, endValue, duration, easeMethod, furtherOptions){

    this.element = element;
    this.duration = duration;
    this.easeMethod = easeMethod || 'linear';
    this.onComplete = furtherOptions && furtherOptions.onComplete;
    this.onUpdate = furtherOptions && furtherOptions.onUpdate;
    this.endValue = endValue;
    this.startValue = element.pageYOffset || 0;

    this.isColourAnimation = false;
    
    this.isFinished = false;    
}

ScrollAnimation.prototype = new Animation();
ScrollAnimation.prototype.constructor = ScrollAnimation;

ScrollAnimation.prototype.tick = function(currentTime){
    if(!this.startTime){
        this.startTime = currentTime;
    }

    var animTime = currentTime - this.startTime;// How long has the animation been running?

    // Are we done?
    if (animTime >= this.duration) {
        // ensure that the ending location is the one we want
        window.scrollTo(this.element, this.endValue)

        // call the callback if we have one
        if(typeof this.onComplete === 'function'){
            this.onComplete();
        }

        this.isFinished = true;
    }
    else {
        var fromValue = this.startValue,
            toValue = this.endValue,
            difference = toValue - fromValue;


        window.scrollTo(this.element, easingFunctions[this.easeMethod](animTime, fromValue, difference, this.duration));

        // the onUpdate callback..
        if(typeof this.onUpdate === 'function'){
            this.onUpdate();
        }       
    }
}



// a standard animation is a standard tween. it can also tween properties of non-html element objects
function StandardAnimation(element, property, value, duration, easeMethod, callback){
    this.initVariables(element, property, value, duration, easeMethod, callback);

    this.startValue = this.isHTMLElement ? parseFloat(this.element.style[this.property] || 1, 10)
                                         : parseFloat(this.element[this.property] || 1, 10);

    this.endValue = parseFloat(value, 10);
    this.endValueUnit = getUnit(value); // the unit our animation is in 
}

StandardAnimation.prototype = new Animation();
StandardAnimation.prototype.constructor = StandardAnimation;







module.exports = Animator;
});
require.register("interactive-diagram/index.js", function(exports, require, module){
require('bind-poly');
require('events-poly');
require('es5-micro-shim');
require('class-list-poly');
require('animation-frame').shim();
module.exports = require('./src/interactiveDiagram.js');
});
require.register("interactive-diagram/src/interactiveDiagram.js", function(exports, require, module){
var findOffset = require('find-offset');
var ContextManager = require('context-manager');
var Animator = require('animator');

  // Start with the constructor
function InteractiveDiagram() {

  //General vars..
  this.contextManager = ContextManager;
  this.animator = new Animator();
  this.started = false;
  this.initResize = false;
  this.animationsFinished =false;
  this.touchDevice;
  this.inputEvent;
  this.downEvent;
  this.upEvent;
  this.overEvent;
  this.outEvent;

  this.itemSelected = false;
  this.responsiveState = 0; //0 = mobile, 1 = tablet, 2 = desktop.. changed in 'handleResize' function called by resizeManager..
  this.itemSelectedIndex;
  this.lockInput = false;
  
  this.textContentPaddingOffset = 16; //Had to hard code this in here in the end as wasn't reliably being worked out by jQuery.
  
  this.swiping = false;
  
  //Different images are needed for different screen sizes (originally using enquire.js but this isn't supported in IE9)..
  this.responsiveImagePaths = new Array();
  
  //Array used to populate and position labels..
  this.labelArray = new Array();

  //Vars to store references to various bits of the DOM structure..
  this.parentDiv;
  this.imageArea;
  this.labelHolder;
  this.textHolderDiv;
  this.img;
  this.carouselBar;
  this.titleBar;
  this.leftArrow;
  this.rightArrow;
  this.startX;
  this.endX; 
  this.startY;
  this.endY;
  this.storedY = 0;
  this.scrollPos = 0; 
  this.startXTime;
  this.endXTime;
  this.instructionsHolder;
  this.closePanelButton;
  this.onOffSwitch;

  //Object to store currently selected item's various aspects (label, content panel etc)
  this.currentlyActive = new Object();

  this._listeners = {};

  this.storeLabelParent;
  this.storeLineDiv;
}

//Init is called by the contextManager module..
InteractiveDiagram.prototype.init = function(contextManager, labels, images, divID, showToggle){
  this.labelArray = labels;
  this.responsiveImagePaths = images;
      
  this.showLabelToggle = !!(showToggle);

  //Check if we're on a touch device and store this boolean..
  this.touchDevice = contextManager.touchDevice();              
      
  //Get references to various bits of structure for later use..
  this.parentDiv = document.querySelector(divID);
  this.imageArea = this.parentDiv.querySelector(".module-interactive-diagram-image-area");
  this.labelHolder = document.createElement('div');
  this.labelHolder.className = "module-interactive-diagram-label-holder";
  this.labelHolder.classList.add('active');
  this.imageArea.appendChild(this.labelHolder);
  this.textHolderDiv = this.parentDiv.querySelector(".module-interactive-diagram-text-area");
  
  // we need to set this here because TweenLite is *retarded*
  // and has a fix for safari that ignores zIndex.
  this.textHolderDiv.style.zIndex = 2000;
  this.img = this.imageArea.querySelector('img');

  // add the title bar
  this.titleBar = document.createElement('div');
  this.titleBar.className = "text-content-title";
  // the close button for the title bar
  this.closePanelButton = document.createElement(this.touchDevice ? 'div' : 'a');
  if(!this.touchDevice ){
    this.closePanelButton.href = "#";
  }
  this.closePanelButton.className = "text-content-close-button";
  // append to markup
  this.titleBar.appendChild(this.closePanelButton);
  this.parentDiv.appendChild(this.titleBar);

  // add the left/right arrow controls
  this.carouselBar = document.createElement('div');
  this.carouselBar.className = 'text-carousel-bar';

  var arrowEl = this.touchDevice ? 'div' : 'a';
  this.leftArrow = document.createElement(arrowEl);
  this.leftArrow.className = 'left-arrow';
  this.rightArrow = document.createElement(arrowEl);
  this.rightArrow.className = 'right-arrow';

  this.carouselBar.appendChild(this.leftArrow);
  this.carouselBar.appendChild(this.rightArrow);
  this.parentDiv.appendChild(this.carouselBar);

  if (this.showLabelToggle) {
    this.onOffSwitch = document.createElement('div');
    this.onOffSwitch.className = 'on-off-switch';
    this.onOffSwitch.innerHTML = 'Hide Labels'
    this.parentDiv.appendChild(this.onOffSwitch);
  }
  
  this.instructionsHolder = this.parentDiv.querySelector(".instructions-holder");

  this.textContent = this.parentDiv.querySelector('.interactive-diagram-text-content');
  this.textContent.classList.remove('active');

  this.closePanelButton.style.display = 'block';  
  //Set up module.. (adds various listeners for resize and scroll etc)..
  contextManager.setup(this);

};

//The first time this module scrolls into view, we run this which creates the labels etc and sets up listeners on labels..
InteractiveDiagram.prototype.beginInteraction = function(){
  //Make inputEvent a string representing the type of input event to bind to when user clicks labels..
  //If we're on a touchDevice we want 'touchstart', otherwise 'click'..
  this.inputEvent = (this.touchDevice == true) ? "touchstart" : "click";
  this.downEvent = (this.touchDevice == true) ? "touchstart" : "mousedown";
  this.upEvent = (this.touchDevice == true) ? "touchend" : "mouseup";
  this.overEvent = "mouseover";
  this.outEvent = "mouseout";
  
  this.createLabels();
  // sorry, we gotta use a timer to make sure the content has made it onto the dom
  // to ensure the heights are calculated properly
  // i know, it's ugly. I'm sorry ;_;
  setTimeout(this.setLabelHeights.bind(this), 500);

  // add a listener for the on/off switch;
  if (this.showLabelToggle) {
    this.onOffSwitch.addEventListener(this.inputEvent, this.toggleLabels.bind(this));
  }

  //If we're on a touch device, set a listener to listen for the beginnings of 
  //a swipe across the text content panel..
  if(this.touchDevice == true){
    this._listeners.textHolderDivDownEvent = this.checkSwipe.bind(this);
    this.textHolderDiv.addEventListener(this.downEvent, this._listeners.textHolderDivDownEvent);
  }
  
  //Add close panel functionality to close button..
  this.closePanelButton.addEventListener(this.upEvent, this.animateOutInfoPanel.bind(this));
  this.closePanelButton.addEventListener(this.inputEvent, this.closePanel.bind(this));  
  this.closePanelButton.addEventListener(this.downEvent, this.downButton.bind(this));
  this.closePanelButton.addEventListener(this.overEvent, this.rolloverButton.bind(this));
  this.closePanelButton.addEventListener(this.outEvent,  this.rolloutButton.bind(this));
  
  // //And left arrow on carousel..
  this.leftArrow.addEventListener(this.inputEvent, this.leftArrowCycle.bind(this));
  this.leftArrow.addEventListener(this.downEvent,  this.downButton.bind(this));
  this.leftArrow.addEventListener(this.overEvent,  this.rolloverButton.bind(this));
  this.leftArrow.addEventListener(this.outEvent,   this.rolloutButton.bind(this));


  // //And right arrow on carousel..
  this.rightArrow.addEventListener(this.inputEvent, this.rightArrowCycle.bind(this));
  this.rightArrow.addEventListener(this.downEvent,  this.downButton.bind(this));
  this.rightArrow.addEventListener(this.overEvent,  this.rolloverButton.bind(this));
  this.rightArrow.addEventListener(this.outEvent,   this.rolloutButton.bind(this));
  
};

// show or hide the labels 
InteractiveDiagram.prototype.toggleLabels = function(event) {

  if (event.currentTarget.classList.contains('active')) {
    event.currentTarget.classList.remove('active');
    event.currentTarget.innerHTML = 'Hide Labels';
  } else {
    event.currentTarget.classList.add('active');
    event.currentTarget.innerHTML = 'Show Labels';
  }


  var lh = this.labelHolder;

  if (this.labelHolder.classList.contains('active')) {
    lh.classList.remove('active');

    lh.style.display = 'none';
    this.animator.animate(lh, {opacity:0}, 500, {easingMethod:'expoOut'});

  } else {
    lh.classList.add('active');
    lh.style.display = 'block';
    this.animator.animate(lh, {opacity:1}, 500, {easingMethod:'expoOut'});


  }

}


// update label position
InteractiveDiagram.prototype.updateLabelsPosition = function(res) {
  var r = res;

  for (var i = 0; i < this.labelArray.length; i++) {
    var label = this.labelArray[i],
        labelParent = label.labelHolderDiv,
        lineDiv = label.dotDiv.parentNode;

    if (label.orientation === "left" || label.orientation === "right") {

      labelParent.style.top = label.pos[r].yPos;
      lineDiv.style.top = label.pos[r].yPos;
      lineDiv.style.width = label.pos[r].xPos;

    } else if (label.orientation === "top" || label.orientation === "bottom") {
      labelParent.style.left = label.pos[r].xPos;
      lineDiv.style.left = label.pos[r].xPos;
      lineDiv.style.height = label.pos[r].yPos;  

    }
  }
}


// create the label markup and attach events
InteractiveDiagram.prototype.createLabels = function() {
  //Go through the main label array creating dom elements and storing various things back in the main array..
  var i;
  for(i=0; i<this.labelArray.length; i++){
    // the current label we'll be operating on
    var label = this.labelArray[i];

    // if you don't pass anything to the label, we
    // assume it's clickable
    if (!Object.prototype.hasOwnProperty.call(label, 'clickable')) {
      label.clickable = true;
    } 

    //Create divs used for line pointers from labels..
    var lineDiv = document.createElement('div');
    lineDiv.className = "line-div-" + label.orientation;
    this.labelHolder.appendChild(lineDiv);

    label.dotDiv = document.createElement('div');
    label.dotDiv.className = 'dot-div' + (!label.clickable ? ' non-clickable' : '');    

    lineDiv.appendChild(label.dotDiv);
    
    //Create label parent div..
    var labelParent = document.createElement('div')
    labelParent.className = 'label-holder-' + label.orientation;
    label.labelHolderDiv = labelParent;
    this.labelHolder.appendChild(labelParent);

          
    
    //Create label div..
    var labelEl = this.touchDevice || !label.clickable ? 'div' : 'a';
    var labelDiv = document.createElement(labelEl);
    // we don't set the text here, we do it after we're done
    // setting up the markup so we can check if we're on a
    // mobile phone (use letters) or not
    labelDiv.className = 'label-' + label.orientation;
    if(labelEl == 'a'){
      labelDiv.href = "#";
    }

    // if it's a non-clickable label, make sure we set the
    // non-clickable class;
    if (!label.clickable) {
      labelDiv.classList.add('non-clickable')
    }
    labelParent.appendChild(labelDiv);
    label.labelDiv = labelDiv;


    //Store associated label's content in object also..
    label.contentDiv = document.querySelector('#' + label.contentID);

    // create the title content for the interactions
    // so that users have to write less markup
    var titleDiv = document.createElement('div');
    titleDiv.id = label.contentID + '_title';
    titleDiv.className = 'title';
    titleDiv.innerHTML = label.text.replace(/<.+>/, ' '); // replace any tags with spaces
    this.titleBar.appendChild(titleDiv)
    label.contentTitleDiv = titleDiv;
    
    //Position labels..
    var r = this.responsiveState;
    // labelParent.css("left", label.xPos);
    if ('left or right labels'.indexOf(label.orientation) >= 0) {
      labelParent.style.top = label.pos[r].yPos;
      lineDiv.style.top = label.pos[r].yPos;
      lineDiv.style.height = 2;
      lineDiv.style.display = "none";

    } else if ('top or bottom labels'.indexOf(label.orientation) >= 0) {
      labelParent.style.left = label.pos[r].xPos;
      lineDiv.style.left = label.pos[r].xPos;
      lineDiv.style.height = 2;
      lineDiv.style.display = "none";
    }
  
    //Set labels to invisible..
    labelDiv.style.opacity = 0;

    //Top labels need to fade and move in from below their final positions..
    //Bottom labels need to fade and move in from above their final positions..
    if(label.orientation == "top"){
      labelDiv.style.top = "8px";

      this.animator.animate(labelDiv, {opacity:1, top: '0px'}, 200, {delay: 500+(i*100), easingMethod: 'expoOut', onComplete: this.popLine.bind(this, i, lineDiv)});
    }else if(label.orientation == "bottom"){
      labelDiv.style.bottom = "8px";
      this.animator.animate(labelDiv, {opacity:1, bottom: '0px'}, 200, {delay: 500+(i*100), easingMethod: 'expoOut', onComplete: this.popLine.bind(this, i, lineDiv)});
    }else if (label.orientation == "left") {
      labelDiv.style.left = "8px";
      this.animator.animate(labelDiv, {opacity:1, left: '0px'}, 200, {delay: 500+(i*100), easingMethod: 'expoOut', onComplete: this.popLine.bind(this, i, lineDiv)});
    }else if (label.orientation == "right") {
      labelDiv.style.right = "8px";
      this.animator.animate(labelDiv, {opacity:1, right: '0px'}, 200, {delay: 500+(i*100), easingMethod: 'expoOut', onComplete: this.popLine.bind(this, i, lineDiv)});
    }

    if (label.clickable){
      labelDiv.addEventListener(this.inputEvent, this.clickLabel.bind(this));
      labelDiv.addEventListener(this.overEvent, this.rollLabel.bind(this));
      labelDiv.addEventListener(this.outEvent, this.rollLabel.bind(this));

      label.dotDiv.addEventListener(this.inputEvent, this.clickLabel.bind(this), true);
      label.dotDiv.addEventListener(this.overEvent, this.rollLabel.bind(this), true);
      label.dotDiv.addEventListener(this.outEvent, this.rollLabel.bind(this), true);
    } 
            
  }

  window.setTimeout(function(){
    this.animationsFinished = true;
  }.bind(this), 500+(i*100));

  // call this to set the correct text
  this.setLabelContent();


}


//Called when we want to animate the line popping out of the label..
InteractiveDiagram.prototype.popLine = function(num, lineJQ){

  lineJQ.style.display = 'block';

  var label = this.labelArray[num];

  var r = this.responsiveState;
  // we activate the shadow of the after pseudo-element now that things are ready
  label.labelDiv.classList.add('shadowOn');


  var inset = parseFloat(window.getComputedStyle(lineJQ)[label.orientation], 10) || 0; // we subtract the inset amount from this width. getcomputedstyle for ;eft/right/top/bottom returns px so we find out what % that is of the interactive
  

  if ('left or right labels'.indexOf(label.orientation) >= 0) {
    var width = parseFloat(label.pos[r].xPos, 10); // the requested position
    inset = inset / parseFloat(this.imageArea.clientWidth, 10) * 100;
    width = width - inset + '%';
    label.pos[r].xPos = width; // we store the updated width (the width taking in to account the inset) so that when updateLabelPositions is called on resize it doesnt need to recalculate anything, it can just use the stored width

    this.animator.animate(lineJQ, {width:width}, 500, {delay: 200, easingMethod:'expoOut'});
  }
  if ('top or bottom labels'.indexOf(label.orientation) >= 0) {
    var height = parseFloat(label.pos[r].yPos, 10); // the requested position
    inset = inset / parseFloat(this.imageArea.clientHeight, 10) * 100;
    height = height - inset + '%';
    label.pos[r].yPos = height;

    this.animator.animate(lineJQ, {height:height}, 500, {delay: 200, easingMethod:'expoOut'});
  }

}

//Rollover and rollout functionality on labels..
InteractiveDiagram.prototype.rollLabel = function(event){
  var self = this;
  var label,
      dot;
  
  //Go through labels and store various aspects of whatever has been selected..
  for(var i=0, l; l = self.labelArray[i]; i++){

      if(event.currentTarget == l.labelDiv || event.currentTarget == l.dotDiv){
        label = l.labelDiv;
        dot = l.dotDiv;      
      } 

  
  }
  
  //Add/remove classes for over state..
  if(label != self.currentlyActive.labelDiv){
    // if(dir == "over"){
    if(event.type === self.overEvent){
      label.classList.add("over");
      dot.classList.add("over");
    // }else if(dir == "out"){
    }else if(event.type === self.outEvent){
      label.classList.remove("over");
      dot.classList.remove("over");
    }   
  }
}

InteractiveDiagram.prototype.showContent = function(r) {
  //We start looking from text holder div.
  var hdc = this.textHolderDiv.children;

  for (var i = 0; i < hdc.length; i++) {

    for (var k = 0; k < hdc[i].children.length; k++) {
      // Check and remove visible class from elements.
      if (hdc[i].children[k].classList.contains('visible')) {
        hdc[i].children[k].classList.remove('visible');
      }
    }
    // for each children in text holder div we add class visible  at the right one based on responsive state.
    if (hdc[i].children.length != 1) {
      hdc[i].children[r].classList.add('visible');
    } else {
      // if there is just one content for each device we add class visible at the only children div.
      hdc[i].children[0].classList.add('visible');
    }
  }
}

//Called when user clicks a label on the diagram..
InteractiveDiagram.prototype.clickLabel = function(event){
  cancelEvent(event);

  //The first time a label is clicked, 'currentlyActive' has no properties..
  //After that, if we click a label that is already 'on', do nothing..
  if(this.currentlyActive.labelDiv){
    if(event.currentTarget == this.currentlyActive.labelDiv){
      return;
    } else {
      //Deselect the current label etc..
      this.deselectCurrent();       
    }
  }
  
  
  //Go through labels and store various aspects of whatever has been selected (if statement accounts for clicking a LABEL or clicking a DOT)..
  for(var i=0; i<this.labelArray.length; i++){
    var label = this.labelArray[i];

    var isLabel = (event.currentTarget == this.labelArray[i].labelDiv)
    isLabel = isLabel && /label/.test(event.currentTarget.className);
    var isDot = (event.currentTarget == this.labelArray[i].dotDiv)
    isDot = isDot && /dot/.test(event.currentTarget.className);
    if (isLabel || isDot){

      //Store currently active elements
      this.currentlyActive.contentDiv = this.labelArray[i].contentDiv;
      this.currentlyActive.labelDiv = this.labelArray[i].labelDiv;
      this.currentlyActive.dotDiv = this.labelArray[i].dotDiv;
      this.currentlyActive.yPos = this.labelArray[i].yPos;
      this.currentlyActive.contentTitleDiv = this.labelArray[i].contentTitleDiv;

      //And record its index..
      this.itemSelectedIndex = i;
        
    }
            
  }
  
  //Set various styles on text content panel and 
  //individual text panels.. (getting ready to animate in)
  this.textHolderDiv.classList.add("active");
  this.currentlyActive.contentDiv.classList.add("active");
  this.currentlyActive.contentDiv.style.top = 0;
  this.currentlyActive.contentDiv.style.left = 0;
  
  //Get rid of any lingering 'over' states..
  this.currentlyActive.labelDiv.classList.remove("over");
  this.currentlyActive.dotDiv.classList.remove("over");  
  this.currentlyActive.contentTitleDiv.classList.add("active");

  this.showContent(this.responsiveState);
      
  //Set text position (this is needed because depending on 
  //what responsive layout we have, there is quite a difference 
  //in the location of the text panel)       
  this.setTextContentPosition();
  this.animateInInfoPanel();
  
  //Set title bar and carousel bar to active..
  this.carouselBar.classList.add("active");
  this.titleBar.classList.add("active");
  
  //Finally, highlight selected label..
  this.highlightLabel();
  
  
}

//Called when a label is clicked, when the carousel is cycled 
//or when a dot is clicked..
InteractiveDiagram.prototype.highlightLabel = function(){
  //Set selected label to 'active' class
  this.currentlyActive.labelDiv.classList.add("active"); 
  this.currentlyActive.contentTitleDiv.classList.add("active");

  this.currentlyActive.dotDiv.classList.add('active');
}

//When going from 'no panels showing' to 'panel coming in'..
InteractiveDiagram.prototype.animateInInfoPanel = function(){
  //i == 0 Mobiles! 
  //i == 1 Tablets!       
  //i == 2 Desktop! 
  
  //Ok... Because of the fixed positioning of the title bar and the carousel (team wanted content scrolling 'underneath' these),
  //The width of the text panel with and without scrollbars is different so we need to account for this..
  
  //Calculate how much to nudge title bar and carousel button over by (ie. width of scrollbar)
  // define it as the difference between the client and the offset (i.e. get the width of the scrollbar)
  var scrollBarNudge = this.textHolderDiv.offsetWidth - this.textHolderDiv.clientWidth;
  
  //On desktop, nudge the title bar and right-hand carousel button along if we have scrollbars..
  if(this.responsiveState == 2){
    // properties for title bar and carouselbar before we start the animation
    var cssprops = {
      "right": -this.parentDiv.offsetWidth,
      // the two here is to add a bit of distance.
      "width": this.parentDiv.offsetWidth/3
      }; 

    //Position then animate in title bar (from right)..
    this.titleBar.style.right = cssprops.right + "px";
    this.titleBar.style.width = cssprops.width + "px";

    this.animator.animate(this.titleBar, {right: '0px'}, 500, {easingMethod:'expoOut'});
    
    //Position then animate in carousel (from right)..
    this.carouselBar.style.right = cssprops.right + "px";
    this.carouselBar.style.width = cssprops.width + "px";

    this.animator.animate(this.carouselBar, {right: '0px'}, 500, {easingMethod:'expoOut'});
    
    //Position actual info panel then animate in from the right..     
    this.textHolderDiv.style.right = cssprops.right + "px";
    this.textHolderDiv.style.width = cssprops.width + scrollBarNudge + 'px';

    this.animator.animate(this.textHolderDiv, {right: -scrollBarNudge + 'px'}, 500, {easingMethod:'expoOut'});
  
  //On mobile and tablet... Position everything to the left and animate on from the left..
  }else if(this.responsiveState == 0 || this.responsiveState == 1){
    
    this.titleBar.style.left = -this.textHolderDiv.offsetWidth + 'px';
    this.carouselBar.style.left = -this.textHolderDiv.offsetWidth + 'px';
    this.textHolderDiv.style.left = -this.textHolderDiv.offsetWidth + 'px';

    this.animator.animate(this.titleBar, {left: '0px'}, 500, {easingMethod:'expoOut'});
    this.animator.animate(this.carouselBar, {left: '0px'}, 500, {easingMethod:'expoOut'});
    this.animator.animate(this.textHolderDiv, {left: '0px'}, 500, {easingMethod:'expoOut'});
    
  }   
  
};



//Animate away info panel (ie. when closed).. 
InteractiveDiagram.prototype.animateOutInfoPanel = function(event){
  event.preventDefault(); 
  
  //Reset close button and instructions..
  this.closePanelButton.classList.remove("mousedown");
  this.closePanelButton.classList.remove("over");

  this.closePanel();
};

//Rollover functionality for carousel and close buttons..
InteractiveDiagram.prototype.rolloverButton = function(event){

  if(/close/.test(event.currentTarget.className)){
    return this.closePanelButton.classList.add("over");
    //self.closePanelButton.css("background-position", "0px -44px");
  }
  if(/left/.test(event.currentTarget.className)){
    return this.leftArrow.style.backgroundPosition = "0px -44px";
  }
  if(/right/.test(event.currentTarget.className)){
    return this.rightArrow.style.backgroundPosition = "0px -44px";
  }
   
};

//Rollout functionality for carousel and close buttons..
InteractiveDiagram.prototype.rolloutButton = function(event){
  
  if(/close/.test(event.currentTarget.className)){
    return this.closePanelButton.classList.remove("over");
    //self.closePanelButton.css("background-position", "0px 0px");
  }
  if(/left/.test(event.currentTarget.className)){
    return this.leftArrow.style.backgroundPosition = "0px 0px";
  }
  if(/right/.test(event.currentTarget.className)){
    return this.rightArrow.style.backgroundPosition ="0px 0px";
  }
      
};

//'mousedown' or tapped state functionality for close and carousel buttons..
InteractiveDiagram.prototype.downButton = function(event){
  cancelEvent(event);

  if(/close/.test(event.currentTarget.className)){
    return this.closePanelButton.classList.remove("mousedown");
    //self.closePanelButton.css("background-position", "0px -88px");
  }
  if(/left/.test(event.currentTarget.className)){
    return this.leftArrow.style.backgroundPosition = "0px -88px";
  }
  if(/right/.test(event.currentTarget.className)){
    return this.rightArrow.style.backgroundPosition = "0px -88px";
  }
      
};


//As soon as the user touches the screen, we call this which sets up listeners to allow us to test for swiping later..
InteractiveDiagram.prototype.checkSwipe = function(event){  

  this.startX = event.touches[0].pageX;
  this.startY = event.touches[0].pageY;
      
  this.startXTime = event.timeStamp;

  this.addBodySwipeListeners();
};

//On moving finger... (across text panel)
InteractiveDiagram.prototype.checkMotion = function(event){       

  event.stopPropagation();
  event.preventDefault();
  
  var diffX;
  
  var diffY = this.startY - event.touches[0].pageY;
  
  var scrollPosCheck = this.storedY + diffY;

  // calculate the maxHeight for the posCheck
  var maxHeight = this.currentlyActive.contentDiv.offsetHeight;
      maxHeight -= this.textHolderDiv.offsetHeight;
      maxHeight += this.carouselBar.offsetHeight + 20;


  //Vars for scrolling text content inside parent div..
  if(scrollPosCheck > 0 && scrollPosCheck < maxHeight){
    this.scrollPos = scrollPosCheck;      
  }else if(scrollPosCheck < 0){
    this.scrollPos = 0;
  }     
  
  //Scroll content inside div..
  this.currentlyActive.contentDiv.parentNode.scrollTop = this.scrollPos;

  
  //Each time the touchmove event is fired, as long as the users touch is left of the original touch..
  if(event.touches[0].pageX < this.startX){
    //Move panel left..
    diffX = 0 - (this.startX - event.touches[0].pageX);
  }
  //Keep recording touch location so we can use this on touchend..
  this.endX = event.touches[0].pageX;
        
};

// adds swipe listeners to the body
InteractiveDiagram.prototype.addBodySwipeListeners = function() {
  // add the listeners for swiping. only add once else we end up will all sorts of problems.
  if(!this.swipeListenersAdded){
    this._listeners.bodyTouchmove =  this.checkMotion.bind(this);
    //checkMotion called when moving finger, 
    document.body.addEventListener("touchmove", this._listeners.bodyTouchmove);

    this._listeners.bodyTouchend = this.cancelSwipe.bind(this);
    //cancelSwipe called when letting go..
    document.body.addEventListener("touchend", this._listeners.bodyTouchend);

    this.swipeListenersAdded = true;
  }
}

// removes the listeners from the body
InteractiveDiagram.prototype.removeBodySwipeListeners = function() {
  // removing the fingermove listener
  document.body.removeEventListener("touchmove", this._listeners.bodyTouchmove);
  // and the letting go listener
  document.body.removeEventListener("touchend", this._listeners.bodyTouchend);

  this.swipeListenersAdded = false;

};




//If the user lets go after starting a swipe, we cancel the swipe..
InteractiveDiagram.prototype.cancelSwipe = function(event){   
  event.stopPropagation();
      
  //Take off listeners we were using for swipe functionality..
  this.removeBodySwipeListeners();
  
  this.endXTime = event.timeStamp;    
  this.storedY = this.scrollPos;
  
  //Work out total distance and total time between start and end touch events..
  var totalDistance = this.startX - this.endX;
  var totalTime = this.endXTime - this.startXTime;
  
  //Work out direction of swipe..     
  var dir;
  if(this.startX < this.endX){
    dir = -1;
  }else if(this.startX > this.endX){
    dir = 1;
  }
  //totalDistance/totalTime is a ratio we can use to detect if this was a 'swipe' or not..
  //Also, automatically register as a swipe if the panel's right-most edge is less than halfway across the area..
  if(Math.abs(totalDistance/totalTime) > 0.8){
    //Successful swipe.. close panel!
    this.cycleCarousel(dir);
  }else{
    //Not swiped..
  }
  
};

//At various times we need to make sure the text/info in the panel is correctly positioned. 
//This function is called when we trip over the responsive cutoffs
//and at any other time we need to make sure the text position is correct..    
InteractiveDiagram.prototype.setTextContentPosition = function(){
  //i == 0 Mobiles! 
  //i == 1 Tablets!       
  //i == 2 Destop!

  
  //If we have a selected item..    
  if(this.currentlyActive.contentDiv){
    //By default it should be position top:0..      
    var topLoc = 0;
    var textHolderDivTop = window.getComputedStyle(this.textHolderDiv).top || 0;

    
    //On desktop and mobile phones, position text top.
    if(this.responsiveState == 0){
        //  we need to size this so that the panel does not overlap the header
        //  unfortunately we are not supplied a reference to the header so we have to make
        // our app know entirely too much about the containing page and get it itself :(
        var bbcHeader = document.querySelector('#guide > .k-g-header');
        var offset = bbcHeader ? bbcHeader.clientHeight : 0;
        
        this.titleBar.style.top = offset +'px';
        this.textHolderDiv.style.top = parseInt(textHolderDivTop, 10) + offset +'px';
    }else if (this.responsiveState == 1){
      topLoc = "";
      this.titleBar.style.top = '0px';       
      this.textHolderDiv.style.top = topLoc;
    } else {
      this.titleBar.style.top = '';
      this.textHolderDiv.style.top = '';

    }
    
  }
  
  //resetPanelPos is used to clear any inline properties added by the poisitoning of the text across different screensizes etc..
  this.resetPanelPos();
};

// This function sets the label contents to just one letter if we're on mobile, 
// otherwise we show the full text. It's called by handleResponsiveChange
InteractiveDiagram.prototype.setLabelContent = function() {
  var l, i, content;
  for (i = 0; i < this.labelArray.length; i++) {
    l = this.labelArray[i];
    if (l.clickable && (this.responsiveState === 0)) {
      // we count up the ABC, A's char code is 65
      // neat way to go up the alphabet
      content = String.fromCharCode(65 + i);
    } else {
      content = l.text;
    }
    if (Object.prototype.hasOwnProperty.call(l, 'labelDiv')) {
      l.labelDiv.innerHTML = content;
    }
  }
}

// fix heights of labels
InteractiveDiagram.prototype.setLabelHeights = function() {
  var l, i;
  for (i = 0; i < this.labelArray.length; i++) {
    l = this.labelArray[i].labelDiv;
    if (l) {
      if (Object.prototype.hasOwnProperty.call(l, 'parentNode')) {
        l.parentNode.style.height = l.clientHeight + 'px';
      }
    }
  }
}



//Called when user swipes panel away or clicks 'close'..
InteractiveDiagram.prototype.closePanel = function(e){
  if(e){
    cancelEvent(e);
  }
    
  this.itemSelected = false;
  
  //Set various elements to inactive..
  //this.instructionsHolder.classList.add("active");
  this.textHolderDiv.classList.remove("active");
  this.carouselBar.classList.remove("active");
  this.titleBar.classList.remove("active")
    
  //Deselect whatever is currently highlighted..
  this.deselectCurrent(); 
  
  //resetPanelPos is used to clear any inline properties added by the poisitoning of the text across different screensizes etc..
  this.resetPanelPos();
  
  this.currentlyActive.labelDiv = null;
  this.closePanelButton.classList.remove("mousedown")
  this.closePanelButton.classList.remove("over")
    
};

//Called from various places when we need to ensure panel is in correct position and inline styles have been cleared..
InteractiveDiagram.prototype.resetPanelPos = function(){

  
  //On desktop.. (clearProps is used to clear inline styles added by TweenLite/jQuery/JS)
  if(this.responsiveState == 2){

    this.carouselBar.style.left = '';
    this.titleBar.style.left = '';
    this.textHolderDiv.style.left = '';

    
    //We need to make sure the title bar is reset too (position and width) based on if there are scrollbars present or not..
    this.positionTitleBar()
  
  //On mobile or tablet.. 
  }else if(this.responsiveState == 0 || this.responsiveState == 1){

    this.carouselBar.style.right = '';
    this.titleBar.style.right = '';
    this.textHolderDiv.style.right = '';
    this.textHolderDiv.style.width = '';
    
    this.titleBar.style.width = '100%';

    if(this.responsiveState == 0){
      this.resizeMobileHeader()
    } else {
      this.textContent.style.paddingTop = ''; // ensure we are 
    }
  }
};

//When we need to reset title bar..
InteractiveDiagram.prototype.positionTitleBar = function(){
  
  //If an item is currently selected..
  if(this.currentlyActive.contentDiv){
    
    //Calculate the available width for the text (minus the scrollbar)
    // var scrollBarNudge = this.textHolderDiv.offsetWidth - this.currentlyActive.contentDiv.offsetWidth;
    var scrollBarNudge = this.textHolderDiv.offsetWidth - this.textHolderDiv.clientWidth;
    if(this.responsiveState == 2){//Desktop only..

      var cssprops = {
        right: 0 + 'px',
        width : this.parentDiv.offsetWidth/3
      }

      this.titleBar.style.right = cssprops.right;
      this.titleBar.style.width = cssprops.width + 'px';

      this.carouselBar.style.right = cssprops.right;
      this.carouselBar.style.width = cssprops.width + 'px';

      this.textHolderDiv.style.width = cssprops.width + scrollBarNudge + 'px';
      this.textHolderDiv.style.right = -scrollBarNudge + 'px';

    }
  }
};

InteractiveDiagram.prototype.leftArrowCycle = function(event){
  event.preventDefault();
  
  //Cycle carousel left...    
  this.cycleCarousel(-1);
};

InteractiveDiagram.prototype.rightArrowCycle = function(event){
  event.preventDefault();
  
  //Cycle carousel right...
  this.cycleCarousel(1);
};

//When carousel is cycled either way, this function is called..
InteractiveDiagram.prototype.cycleCarousel = function(dir){
  
  //If input is locked (ie. already animating).. Don't do anything.
  if(this.lockInput == true){
    return;
  }else{
    this.lockInput = true;
  } 
  
  //Reset carousel button sprites..
  this.leftArrow.style.backgroundPosition = "0px 0px";
  this.rightArrow.style.backgroundPosition= "0px 0px";
  
  //Record current selected item..
  var currentPanelIndex = this.itemSelectedIndex;
  var endLoc;
  
  
  //If we're going right..
  if(dir > 0){ 
    //Calculate position to move to..
    endLoc = -this.textHolderDiv.offsetWidth;
    
    //Get next item index.. (cycle around iteration)..
    do {
      this.itemSelectedIndex = (++this.itemSelectedIndex) % this.labelArray.length
      
    } while (!this.labelArray[this.itemSelectedIndex].clickable)

  //Else left..
  }else if(dir < 0){
    //Calculate position to move to..
    endLoc = this.textHolderDiv.offsetWidth;
    
    //Get next item index.. (cycle around iteration)..
    do {
      this.itemSelectedIndex = --this.itemSelectedIndex;
      if (this.itemSelectedIndex < 0) this.itemSelectedIndex = this.labelArray.length - 1;
    } while (!this.labelArray[this.itemSelectedIndex].clickable)
  }
  
  //Move CURRENT selected item's text content along based on the above 'endLoc' final x location..
  var r = this.responsiveState;  
  this.animator.animate(this.labelArray[currentPanelIndex].contentDiv, {left: endLoc+'px'}, 500, {easingMethod:'expoOut'});
  
  
  //Deselect the current label etc..
  if(this.currentlyActive.dotDiv){
    this.currentlyActive.dotDiv.classList.remove('active')
  }
  if(this.currentlyActive.labelDiv){
    this.currentlyActive.labelDiv.classList.remove("active");
  }
  if(this.currentlyActive.contentTitleDiv){
    this.currentlyActive.contentTitleDiv.classList.remove("active");
  }
  
  //Make a note of all of the relevant properties of the newly highlighted item..
  this.currentlyActive.contentDiv = this.labelArray[this.itemSelectedIndex].contentDiv;
  this.currentlyActive.labelDiv = this.labelArray[this.itemSelectedIndex].labelDiv;
  this.currentlyActive.dotDiv = this.labelArray[this.itemSelectedIndex].dotDiv;
  this.currentlyActive.yPos = this.labelArray[this.itemSelectedIndex].yPos;
  this.currentlyActive.contentTitleDiv = this.labelArray[this.itemSelectedIndex].contentTitleDiv;
  
  // this is the same as saying
  
  this.currentlyActive.contentDiv.classList.add("active");
  this.currentlyActive.dotDiv.classList.add('active');
  
  //Position new incoming text element to the left or right of the old one..
  if(dir > 0){ //Right
    this.currentlyActive.contentDiv.style.left = this.textHolderDiv.offsetWidth + "px";
    this.currentlyActive.contentDiv.style.top = 0;
  }else if(dir < 0){ //Left
    this.currentlyActive.contentDiv.style.left = -this.textHolderDiv.offsetWidth + "px";
    this.currentlyActive.contentDiv.style.top = 0;
  }
  
  //Move new incoming element into final position.. then once done call 'resetInfoPanelContent'   
  this.animator.animate(this.currentlyActive.contentDiv, {left:'0px'}, 500, {easingMethod: 'expoOut', onComplete:this.resetInfoPanelContent.bind(this) });
    
  //Then highlight the current label
  this.highlightLabel(this);    
} 

//Reset info panel.. at end of cycling carousel 
InteractiveDiagram.prototype.resetInfoPanelContent = function(){
  //Go through main array..         
  for(var i=0; i<this.labelArray.length; i++){
    var infoPanel = this.labelArray[i].contentDiv;
    
    //Any content div which isn't the one highlighted, make sure it's not set to 'active' (ie. make sure its not visible)
    if(this.currentlyActive.contentDiv != infoPanel){
      if (infoPanel) {
        infoPanel.classList.remove("active");        
      }
    }
  } 
  

  //Set title bar position..
  this.positionTitleBar();    
  
  //Set vars back to initial conditions..
  this.scrollPos = 0;
  this.storedY = 0;
  this.swiping = false;
  this.lockInput = false;       
}

//In view called by Context Manager when pattern is on-screen in viewport..
InteractiveDiagram.prototype.inView = function(){
  if(!this.started){
    this.started = true;
    this.beginInteraction();
  }
}
//Out of view called by Context Manager when pattern is off-screen..
InteractiveDiagram.prototype.outOfView = function(){
  // when using the mobile view we want to close any open panel if we are not on the part of the page with the interactive
  if(this.responsiveState === 0){
    this.closePanel();
  }
}

//Deselect currently highlighted label..
InteractiveDiagram.prototype.deselectCurrent = function(){
      
  if(this.currentlyActive.dotDiv){
    //TweenLite.to(this.currentlyActive.dotDiv, 0.5, {scale:1, ease:Expo.easeOut});

    this.currentlyActive.dotDiv.classList.remove('active');
  }
  if(this.currentlyActive.labelDiv){
    this.currentlyActive.labelDiv.classList.remove("active");
  }
  if(this.currentlyActive.contentDiv){
    this.currentlyActive.contentDiv.classList.remove("active");
  }
  if(this.currentlyActive.contentTitleDiv){
    this.currentlyActive.contentTitleDiv.classList.remove("active");
  }
}

//Called when resize trips over a responsive cutoff (called by Context Manager)..
InteractiveDiagram.prototype.handleResponsiveChange = function(i){

  this.responsiveState = i;

  //Set text position..
  this.setTextContentPosition();

  //Set the labels
  this.setLabelContent();

  //fix their height
  if (this.started) this.setLabelHeights();
    
  
  if(this.initResize == false){
    this.initResize = true;
    this.imageArea.classList.add("active");
  }
  
  //Also change the actual img 'src' attribute.. 
  //This loads in large/medium/small images using the path in the 'responsiveImagePaths' array..
  this.img.src = this.responsiveImagePaths[i].image;

  this.resized();
}

//Called on resize..
InteractiveDiagram.prototype.resized = function(){
  var self = this;
  // Responsive contents
  this.showContent(this.responsiveState);
  this.animationsFinished && self.updateLabelsPosition(self.responsiveState);
  window.onresize = function() {
    //self.updateLabelsPosition(self.responsiveState);
  };

  this.resizeMobileHeader();
  
}

// this is a last minute fix for moving the close button away from the bbcs
//  navigation bar thing until they sort out their own z-indexing issues
// to be clear: I know what is going on here is horrible and hacky, but it is a 
// temporary stopgap.
InteractiveDiagram.prototype.resizeMobileHeader = function(){

  if(this.responsiveState === 0){
    // we need to check that it's positioned correctly vertically :(

    this.titleBar.style.display = 'block'; // we make it visible to compute its height

    var bbcHeader = document.querySelector('#guide > .k-g-header');
    var offset = bbcHeader ? bbcHeader.clientHeight : 0;
    var titleBarHeight = this.titleBar.clientHeight;

    this.titleBar.style.display = '';

    this.titleBar.style.top = offset+'px';
    this.textHolderDiv.style.top = titleBarHeight + offset+'px';

  }
}

function cancelEvent(e){
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    // otherwise set the returnValue property of the original event to false (IE)
    e.returnValue = false;
  }
}

// export the Interactive Diagram
module.exports = InteractiveDiagram;

});
























require.alias("gamtiq-es5-micro-shim/index.js", "interactive-diagram/deps/es5-micro-shim/index.js");
require.alias("gamtiq-es5-micro-shim/index.js", "interactive-diagram/deps/es5-micro-shim/index.js");
require.alias("gamtiq-es5-micro-shim/index.js", "es5-micro-shim/index.js");
require.alias("danmilon-object.keys-shim/index.js", "gamtiq-es5-micro-shim/deps/object.keys-shim/index.js");
require.alias("danmilon-object.keys-shim/index.js", "gamtiq-es5-micro-shim/deps/object.keys-shim/index.js");
require.alias("danmilon-object.keys-shim/index.js", "danmilon-object.keys-shim/index.js");
require.alias("enyo-functionbind/index.js", "gamtiq-es5-micro-shim/deps/functionbind/index.js");

require.alias("gamtiq-object-create-shim/index.js", "gamtiq-es5-micro-shim/deps/object-create-shim/index.js");
require.alias("gamtiq-object-create-shim/index.js", "gamtiq-es5-micro-shim/deps/object-create-shim/index.js");
require.alias("gamtiq-object-create-shim/index.js", "gamtiq-object-create-shim/index.js");
require.alias("gamtiq-isarray-shim/index.js", "gamtiq-es5-micro-shim/deps/isarray-shim/index.js");
require.alias("gamtiq-isarray-shim/index.js", "gamtiq-es5-micro-shim/deps/isarray-shim/index.js");
require.alias("gamtiq-isarray-shim/index.js", "gamtiq-isarray-shim/index.js");
require.alias("gamtiq-array-indexof-shim/index.js", "gamtiq-es5-micro-shim/deps/array-indexof-shim/index.js");
require.alias("gamtiq-array-indexof-shim/index.js", "gamtiq-es5-micro-shim/deps/array-indexof-shim/index.js");
require.alias("gamtiq-array-indexof-shim/index.js", "gamtiq-array-indexof-shim/index.js");
require.alias("gamtiq-es5-micro-shim/index.js", "gamtiq-es5-micro-shim/index.js");
require.alias("context-manager/index.js", "interactive-diagram/deps/context-manager/index.js");
require.alias("context-manager/index.js", "interactive-diagram/deps/context-manager/index.js");
require.alias("context-manager/index.js", "context-manager/index.js");
require.alias("jb55-domready/index.js", "context-manager/deps/domready/index.js");

require.alias("bind-poly/index.js", "context-manager/deps/bind-poly/index.js");
require.alias("bind-poly/index.js", "context-manager/deps/bind-poly/index.js");
require.alias("bind-poly/index.js", "bind-poly/index.js");
require.alias("events-poly/index.js", "context-manager/deps/events-poly/index.js");
require.alias("events-poly/index.js", "context-manager/deps/events-poly/index.js");
require.alias("events-poly/index.js", "events-poly/index.js");
require.alias("find-offset/index.js", "context-manager/deps/find-offset/index.js");
require.alias("find-offset/index.js", "context-manager/deps/find-offset/index.js");
require.alias("find-offset/index.js", "find-offset/index.js");
require.alias("context-manager/index.js", "context-manager/index.js");
require.alias("bind-poly/index.js", "interactive-diagram/deps/bind-poly/index.js");
require.alias("bind-poly/index.js", "interactive-diagram/deps/bind-poly/index.js");
require.alias("bind-poly/index.js", "bind-poly/index.js");
require.alias("bind-poly/index.js", "bind-poly/index.js");
require.alias("class-list-poly/index.js", "interactive-diagram/deps/class-list-poly/index.js");
require.alias("class-list-poly/index.js", "interactive-diagram/deps/class-list-poly/index.js");
require.alias("class-list-poly/index.js", "class-list-poly/index.js");
require.alias("class-list-poly/index.js", "class-list-poly/index.js");
require.alias("events-poly/index.js", "interactive-diagram/deps/events-poly/index.js");
require.alias("events-poly/index.js", "interactive-diagram/deps/events-poly/index.js");
require.alias("events-poly/index.js", "events-poly/index.js");
require.alias("events-poly/index.js", "events-poly/index.js");
require.alias("find-offset/index.js", "interactive-diagram/deps/find-offset/index.js");
require.alias("find-offset/index.js", "interactive-diagram/deps/find-offset/index.js");
require.alias("find-offset/index.js", "find-offset/index.js");
require.alias("find-offset/index.js", "find-offset/index.js");
require.alias("animation-frame/index.js", "interactive-diagram/deps/animation-frame/index.js");
require.alias("animation-frame/index.js", "animation-frame/index.js");

require.alias("animator/index.js", "interactive-diagram/deps/animator/index.js");
require.alias("animator/index.js", "interactive-diagram/deps/animator/index.js");
require.alias("animator/index.js", "animator/index.js");
require.alias("animator/index.js", "animator/index.js");
require.alias("interactive-diagram/index.js", "interactive-diagram/index.js");if (typeof exports == "object") {
  module.exports = require("interactive-diagram");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("interactive-diagram"); });
} else {
  this["interactive-diagram"] = require("interactive-diagram");
}})();