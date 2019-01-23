// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/refractor/index.js":[function(require,module,exports) {
'use strict'

var refractor = require('./core.js')

module.exports = refractor

refractor.register(require('./lang/abap.js'))
refractor.register(require('./lang/actionscript.js'))
refractor.register(require('./lang/ada.js'))
refractor.register(require('./lang/apacheconf.js'))
refractor.register(require('./lang/apl.js'))
refractor.register(require('./lang/applescript.js'))
refractor.register(require('./lang/arduino.js'))
refractor.register(require('./lang/arff.js'))
refractor.register(require('./lang/asciidoc.js'))
refractor.register(require('./lang/asm6502.js'))
refractor.register(require('./lang/aspnet.js'))
refractor.register(require('./lang/autohotkey.js'))
refractor.register(require('./lang/autoit.js'))
refractor.register(require('./lang/bash.js'))
refractor.register(require('./lang/basic.js'))
refractor.register(require('./lang/batch.js'))
refractor.register(require('./lang/bison.js'))
refractor.register(require('./lang/brainfuck.js'))
refractor.register(require('./lang/bro.js'))
refractor.register(require('./lang/c.js'))
refractor.register(require('./lang/clojure.js'))
refractor.register(require('./lang/coffeescript.js'))
refractor.register(require('./lang/cpp.js'))
refractor.register(require('./lang/crystal.js'))
refractor.register(require('./lang/csharp.js'))
refractor.register(require('./lang/csp.js'))
refractor.register(require('./lang/css-extras.js'))
refractor.register(require('./lang/d.js'))
refractor.register(require('./lang/dart.js'))
refractor.register(require('./lang/diff.js'))
refractor.register(require('./lang/django.js'))
refractor.register(require('./lang/docker.js'))
refractor.register(require('./lang/eiffel.js'))
refractor.register(require('./lang/elixir.js'))
refractor.register(require('./lang/elm.js'))
refractor.register(require('./lang/erb.js'))
refractor.register(require('./lang/erlang.js'))
refractor.register(require('./lang/flow.js'))
refractor.register(require('./lang/fortran.js'))
refractor.register(require('./lang/fsharp.js'))
refractor.register(require('./lang/gedcom.js'))
refractor.register(require('./lang/gherkin.js'))
refractor.register(require('./lang/git.js'))
refractor.register(require('./lang/glsl.js'))
refractor.register(require('./lang/go.js'))
refractor.register(require('./lang/graphql.js'))
refractor.register(require('./lang/groovy.js'))
refractor.register(require('./lang/haml.js'))
refractor.register(require('./lang/handlebars.js'))
refractor.register(require('./lang/haskell.js'))
refractor.register(require('./lang/haxe.js'))
refractor.register(require('./lang/hpkp.js'))
refractor.register(require('./lang/hsts.js'))
refractor.register(require('./lang/http.js'))
refractor.register(require('./lang/ichigojam.js'))
refractor.register(require('./lang/icon.js'))
refractor.register(require('./lang/inform7.js'))
refractor.register(require('./lang/ini.js'))
refractor.register(require('./lang/io.js'))
refractor.register(require('./lang/j.js'))
refractor.register(require('./lang/java.js'))
refractor.register(require('./lang/jolie.js'))
refractor.register(require('./lang/json.js'))
refractor.register(require('./lang/jsx.js'))
refractor.register(require('./lang/julia.js'))
refractor.register(require('./lang/keyman.js'))
refractor.register(require('./lang/kotlin.js'))
refractor.register(require('./lang/latex.js'))
refractor.register(require('./lang/less.js'))
refractor.register(require('./lang/liquid.js'))
refractor.register(require('./lang/lisp.js'))
refractor.register(require('./lang/livescript.js'))
refractor.register(require('./lang/lolcode.js'))
refractor.register(require('./lang/lua.js'))
refractor.register(require('./lang/makefile.js'))
refractor.register(require('./lang/markdown.js'))
refractor.register(require('./lang/markup-templating.js'))
refractor.register(require('./lang/matlab.js'))
refractor.register(require('./lang/mel.js'))
refractor.register(require('./lang/mizar.js'))
refractor.register(require('./lang/monkey.js'))
refractor.register(require('./lang/n4js.js'))
refractor.register(require('./lang/nasm.js'))
refractor.register(require('./lang/nginx.js'))
refractor.register(require('./lang/nim.js'))
refractor.register(require('./lang/nix.js'))
refractor.register(require('./lang/nsis.js'))
refractor.register(require('./lang/objectivec.js'))
refractor.register(require('./lang/ocaml.js'))
refractor.register(require('./lang/opencl.js'))
refractor.register(require('./lang/oz.js'))
refractor.register(require('./lang/parigp.js'))
refractor.register(require('./lang/parser.js'))
refractor.register(require('./lang/pascal.js'))
refractor.register(require('./lang/perl.js'))
refractor.register(require('./lang/php-extras.js'))
refractor.register(require('./lang/php.js'))
refractor.register(require('./lang/plsql.js'))
refractor.register(require('./lang/powershell.js'))
refractor.register(require('./lang/processing.js'))
refractor.register(require('./lang/prolog.js'))
refractor.register(require('./lang/properties.js'))
refractor.register(require('./lang/protobuf.js'))
refractor.register(require('./lang/pug.js'))
refractor.register(require('./lang/puppet.js'))
refractor.register(require('./lang/pure.js'))
refractor.register(require('./lang/python.js'))
refractor.register(require('./lang/q.js'))
refractor.register(require('./lang/qore.js'))
refractor.register(require('./lang/r.js'))
refractor.register(require('./lang/reason.js'))
refractor.register(require('./lang/renpy.js'))
refractor.register(require('./lang/rest.js'))
refractor.register(require('./lang/rip.js'))
refractor.register(require('./lang/roboconf.js'))
refractor.register(require('./lang/ruby.js'))
refractor.register(require('./lang/rust.js'))
refractor.register(require('./lang/sas.js'))
refractor.register(require('./lang/sass.js'))
refractor.register(require('./lang/scala.js'))
refractor.register(require('./lang/scheme.js'))
refractor.register(require('./lang/scss.js'))
refractor.register(require('./lang/smalltalk.js'))
refractor.register(require('./lang/smarty.js'))
refractor.register(require('./lang/soy.js'))
refractor.register(require('./lang/sql.js'))
refractor.register(require('./lang/stylus.js'))
refractor.register(require('./lang/swift.js'))
refractor.register(require('./lang/tap.js'))
refractor.register(require('./lang/tcl.js'))
refractor.register(require('./lang/textile.js'))
refractor.register(require('./lang/tsx.js'))
refractor.register(require('./lang/tt2.js'))
refractor.register(require('./lang/twig.js'))
refractor.register(require('./lang/typescript.js'))
refractor.register(require('./lang/vbnet.js'))
refractor.register(require('./lang/velocity.js'))
refractor.register(require('./lang/verilog.js'))
refractor.register(require('./lang/vhdl.js'))
refractor.register(require('./lang/vim.js'))
refractor.register(require('./lang/visual-basic.js'))
refractor.register(require('./lang/wasm.js'))
refractor.register(require('./lang/wiki.js'))
refractor.register(require('./lang/xeora.js'))
refractor.register(require('./lang/xojo.js'))
refractor.register(require('./lang/xquery.js'))
refractor.register(require('./lang/yaml.js'))

},{"./core.js":"../node_modules/refractor/core.js","./lang/abap.js":"../node_modules/refractor/lang/abap.js","./lang/actionscript.js":"../node_modules/refractor/lang/actionscript.js","./lang/ada.js":"../node_modules/refractor/lang/ada.js","./lang/apacheconf.js":"../node_modules/refractor/lang/apacheconf.js","./lang/apl.js":"../node_modules/refractor/lang/apl.js","./lang/applescript.js":"../node_modules/refractor/lang/applescript.js","./lang/arduino.js":"../node_modules/refractor/lang/arduino.js","./lang/arff.js":"../node_modules/refractor/lang/arff.js","./lang/asciidoc.js":"../node_modules/refractor/lang/asciidoc.js","./lang/asm6502.js":"../node_modules/refractor/lang/asm6502.js","./lang/aspnet.js":"../node_modules/refractor/lang/aspnet.js","./lang/autohotkey.js":"../node_modules/refractor/lang/autohotkey.js","./lang/autoit.js":"../node_modules/refractor/lang/autoit.js","./lang/bash.js":"../node_modules/refractor/lang/bash.js","./lang/basic.js":"../node_modules/refractor/lang/basic.js","./lang/batch.js":"../node_modules/refractor/lang/batch.js","./lang/bison.js":"../node_modules/refractor/lang/bison.js","./lang/brainfuck.js":"../node_modules/refractor/lang/brainfuck.js","./lang/bro.js":"../node_modules/refractor/lang/bro.js","./lang/c.js":"../node_modules/refractor/lang/c.js","./lang/clojure.js":"../node_modules/refractor/lang/clojure.js","./lang/coffeescript.js":"../node_modules/refractor/lang/coffeescript.js","./lang/cpp.js":"../node_modules/refractor/lang/cpp.js","./lang/crystal.js":"../node_modules/refractor/lang/crystal.js","./lang/csharp.js":"../node_modules/refractor/lang/csharp.js","./lang/csp.js":"../node_modules/refractor/lang/csp.js","./lang/css-extras.js":"../node_modules/refractor/lang/css-extras.js","./lang/d.js":"../node_modules/refractor/lang/d.js","./lang/dart.js":"../node_modules/refractor/lang/dart.js","./lang/diff.js":"../node_modules/refractor/lang/diff.js","./lang/django.js":"../node_modules/refractor/lang/django.js","./lang/docker.js":"../node_modules/refractor/lang/docker.js","./lang/eiffel.js":"../node_modules/refractor/lang/eiffel.js","./lang/elixir.js":"../node_modules/refractor/lang/elixir.js","./lang/elm.js":"../node_modules/refractor/lang/elm.js","./lang/erb.js":"../node_modules/refractor/lang/erb.js","./lang/erlang.js":"../node_modules/refractor/lang/erlang.js","./lang/flow.js":"../node_modules/refractor/lang/flow.js","./lang/fortran.js":"../node_modules/refractor/lang/fortran.js","./lang/fsharp.js":"../node_modules/refractor/lang/fsharp.js","./lang/gedcom.js":"../node_modules/refractor/lang/gedcom.js","./lang/gherkin.js":"../node_modules/refractor/lang/gherkin.js","./lang/git.js":"../node_modules/refractor/lang/git.js","./lang/glsl.js":"../node_modules/refractor/lang/glsl.js","./lang/go.js":"../node_modules/refractor/lang/go.js","./lang/graphql.js":"../node_modules/refractor/lang/graphql.js","./lang/groovy.js":"../node_modules/refractor/lang/groovy.js","./lang/haml.js":"../node_modules/refractor/lang/haml.js","./lang/handlebars.js":"../node_modules/refractor/lang/handlebars.js","./lang/haskell.js":"../node_modules/refractor/lang/haskell.js","./lang/haxe.js":"../node_modules/refractor/lang/haxe.js","./lang/hpkp.js":"../node_modules/refractor/lang/hpkp.js","./lang/hsts.js":"../node_modules/refractor/lang/hsts.js","./lang/http.js":"../node_modules/refractor/lang/http.js","./lang/ichigojam.js":"../node_modules/refractor/lang/ichigojam.js","./lang/icon.js":"../node_modules/refractor/lang/icon.js","./lang/inform7.js":"../node_modules/refractor/lang/inform7.js","./lang/ini.js":"../node_modules/refractor/lang/ini.js","./lang/io.js":"../node_modules/refractor/lang/io.js","./lang/j.js":"../node_modules/refractor/lang/j.js","./lang/java.js":"../node_modules/refractor/lang/java.js","./lang/jolie.js":"../node_modules/refractor/lang/jolie.js","./lang/json.js":"../node_modules/refractor/lang/json.js","./lang/jsx.js":"../node_modules/refractor/lang/jsx.js","./lang/julia.js":"../node_modules/refractor/lang/julia.js","./lang/keyman.js":"../node_modules/refractor/lang/keyman.js","./lang/kotlin.js":"../node_modules/refractor/lang/kotlin.js","./lang/latex.js":"../node_modules/refractor/lang/latex.js","./lang/less.js":"../node_modules/refractor/lang/less.js","./lang/liquid.js":"../node_modules/refractor/lang/liquid.js","./lang/lisp.js":"../node_modules/refractor/lang/lisp.js","./lang/livescript.js":"../node_modules/refractor/lang/livescript.js","./lang/lolcode.js":"../node_modules/refractor/lang/lolcode.js","./lang/lua.js":"../node_modules/refractor/lang/lua.js","./lang/makefile.js":"../node_modules/refractor/lang/makefile.js","./lang/markdown.js":"../node_modules/refractor/lang/markdown.js","./lang/markup-templating.js":"../node_modules/refractor/lang/markup-templating.js","./lang/matlab.js":"../node_modules/refractor/lang/matlab.js","./lang/mel.js":"../node_modules/refractor/lang/mel.js","./lang/mizar.js":"../node_modules/refractor/lang/mizar.js","./lang/monkey.js":"../node_modules/refractor/lang/monkey.js","./lang/n4js.js":"../node_modules/refractor/lang/n4js.js","./lang/nasm.js":"../node_modules/refractor/lang/nasm.js","./lang/nginx.js":"../node_modules/refractor/lang/nginx.js","./lang/nim.js":"../node_modules/refractor/lang/nim.js","./lang/nix.js":"../node_modules/refractor/lang/nix.js","./lang/nsis.js":"../node_modules/refractor/lang/nsis.js","./lang/objectivec.js":"../node_modules/refractor/lang/objectivec.js","./lang/ocaml.js":"../node_modules/refractor/lang/ocaml.js","./lang/opencl.js":"../node_modules/refractor/lang/opencl.js","./lang/oz.js":"../node_modules/refractor/lang/oz.js","./lang/parigp.js":"../node_modules/refractor/lang/parigp.js","./lang/parser.js":"../node_modules/refractor/lang/parser.js","./lang/pascal.js":"../node_modules/refractor/lang/pascal.js","./lang/perl.js":"../node_modules/refractor/lang/perl.js","./lang/php-extras.js":"../node_modules/refractor/lang/php-extras.js","./lang/php.js":"../node_modules/refractor/lang/php.js","./lang/plsql.js":"../node_modules/refractor/lang/plsql.js","./lang/powershell.js":"../node_modules/refractor/lang/powershell.js","./lang/processing.js":"../node_modules/refractor/lang/processing.js","./lang/prolog.js":"../node_modules/refractor/lang/prolog.js","./lang/properties.js":"../node_modules/refractor/lang/properties.js","./lang/protobuf.js":"../node_modules/refractor/lang/protobuf.js","./lang/pug.js":"../node_modules/refractor/lang/pug.js","./lang/puppet.js":"../node_modules/refractor/lang/puppet.js","./lang/pure.js":"../node_modules/refractor/lang/pure.js","./lang/python.js":"../node_modules/refractor/lang/python.js","./lang/q.js":"../node_modules/refractor/lang/q.js","./lang/qore.js":"../node_modules/refractor/lang/qore.js","./lang/r.js":"../node_modules/refractor/lang/r.js","./lang/reason.js":"../node_modules/refractor/lang/reason.js","./lang/renpy.js":"../node_modules/refractor/lang/renpy.js","./lang/rest.js":"../node_modules/refractor/lang/rest.js","./lang/rip.js":"../node_modules/refractor/lang/rip.js","./lang/roboconf.js":"../node_modules/refractor/lang/roboconf.js","./lang/ruby.js":"../node_modules/refractor/lang/ruby.js","./lang/rust.js":"../node_modules/refractor/lang/rust.js","./lang/sas.js":"../node_modules/refractor/lang/sas.js","./lang/sass.js":"../node_modules/refractor/lang/sass.js","./lang/scala.js":"../node_modules/refractor/lang/scala.js","./lang/scheme.js":"../node_modules/refractor/lang/scheme.js","./lang/scss.js":"../node_modules/refractor/lang/scss.js","./lang/smalltalk.js":"../node_modules/refractor/lang/smalltalk.js","./lang/smarty.js":"../node_modules/refractor/lang/smarty.js","./lang/soy.js":"../node_modules/refractor/lang/soy.js","./lang/sql.js":"../node_modules/refractor/lang/sql.js","./lang/stylus.js":"../node_modules/refractor/lang/stylus.js","./lang/swift.js":"../node_modules/refractor/lang/swift.js","./lang/tap.js":"../node_modules/refractor/lang/tap.js","./lang/tcl.js":"../node_modules/refractor/lang/tcl.js","./lang/textile.js":"../node_modules/refractor/lang/textile.js","./lang/tsx.js":"../node_modules/refractor/lang/tsx.js","./lang/tt2.js":"../node_modules/refractor/lang/tt2.js","./lang/twig.js":"../node_modules/refractor/lang/twig.js","./lang/typescript.js":"../node_modules/refractor/lang/typescript.js","./lang/vbnet.js":"../node_modules/refractor/lang/vbnet.js","./lang/velocity.js":"../node_modules/refractor/lang/velocity.js","./lang/verilog.js":"../node_modules/refractor/lang/verilog.js","./lang/vhdl.js":"../node_modules/refractor/lang/vhdl.js","./lang/vim.js":"../node_modules/refractor/lang/vim.js","./lang/visual-basic.js":"../node_modules/refractor/lang/visual-basic.js","./lang/wasm.js":"../node_modules/refractor/lang/wasm.js","./lang/wiki.js":"../node_modules/refractor/lang/wiki.js","./lang/xeora.js":"../node_modules/refractor/lang/xeora.js","./lang/xojo.js":"../node_modules/refractor/lang/xojo.js","./lang/xquery.js":"../node_modules/refractor/lang/xquery.js","./lang/yaml.js":"../node_modules/refractor/lang/yaml.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55414" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/refractor.5c664bab.map