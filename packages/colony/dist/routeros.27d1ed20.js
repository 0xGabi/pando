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
})({"../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/routeros.js":[function(require,module,exports) {
module.exports = // Colors from RouterOS terminal:
//   green        - #0E9A00
//   teal         - #0C9A9A
//   purple       - #99069A
//   light-brown  - #9A9900

function(hljs) {

  var STATEMENTS = 'foreach do while for if from to step else on-error and or not in';

  // Global commands: Every global command should start with ":" token, otherwise it will be treated as variable.
  var GLOBAL_COMMANDS = 'global local beep delay put len typeof pick log time set find environment terminal error execute parse resolve toarray tobool toid toip toip6 tonum tostr totime';

  // Common commands: Following commands available from most sub-menus:
  var COMMON_COMMANDS = 'add remove enable disable set get print export edit find run debug error info warning';

  var LITERALS = 'true false yes no nothing nil null';

  var OBJECTS = 'traffic-flow traffic-generator firewall scheduler aaa accounting address-list address align area bandwidth-server bfd bgp bridge client clock community config connection console customer default dhcp-client dhcp-server discovery dns e-mail ethernet filter firewall firmware gps graphing group hardware health hotspot identity igmp-proxy incoming instance interface ip ipsec ipv6 irq l2tp-server lcd ldp logging mac-server mac-winbox mangle manual mirror mme mpls nat nd neighbor network note ntp ospf ospf-v3 ovpn-server page peer pim ping policy pool port ppp pppoe-client pptp-server prefix profile proposal proxy queue radius resource rip ripng route routing screen script security-profiles server service service-port settings shares smb sms sniffer snmp snooper socks sstp-server system tool tracking type upgrade upnp user-manager users user vlan secret vrrp watchdog web-access wireless pptp pppoe lan wan layer7-protocol lease simple raw';

  // print parameters
  // Several parameters are available for print command:
  // ToDo: var PARAMETERS_PRINT = 'append as-value brief detail count-only file follow follow-only from interval terse value-list without-paging where info';
  // ToDo: var OPERATORS = '&& and ! not || or in ~ ^ & << >> + - * /';
  // ToDo: var TYPES = 'num number bool boolean str string ip ip6-prefix id time array';
  // ToDo: The following tokens serve as delimiters in the grammar: ()  []  {}  :   ;   $   / 

  var VAR_PREFIX = 'global local set for foreach';

  var VAR = {
    className: 'variable',
    variants: [
      {begin: /\$[\w\d#@][\w\d_]*/},
      {begin: /\$\{(.*?)}/}
    ]
  };
  
  var QUOTE_STRING = {
    className: 'string',
    begin: /"/, end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  
  var APOS_STRING = {
    className: 'string',
    begin: /'/, end: /'/
  };
  
  var IPADDR = '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\b';
  var IPADDR_wBITMASK =  IPADDR+'/(3[0-2]|[1-2][0-9]|\\d)';
  //////////////////////////////////////////////////////////////////////
  return {
    aliases: ['routeros', 'mikrotik'],
    case_insensitive: true,
    lexemes: /:?[\w-]+/,
    keywords: {
      literal: LITERALS,
      keyword: STATEMENTS + ' :' + STATEMENTS.split(' ').join(' :') + ' :' + GLOBAL_COMMANDS.split(' ').join(' :'),
    },
    contains: [
      { // недопустимые конструкции
        variants: [
          { begin: /^@/, end: /$/, },               // dns
          { begin: /\/\*/, end: /\*\//, },          // -- comment
          { begin: /%%/, end: /$/, },               // -- comment
          { begin: /^'/, end: /$/, },               // Monkey one line comment
          { begin: /^\s*\/[\w-]+=/, end: /$/, },    // jboss-cli
          { begin: /\/\//, end: /$/, },             // Stan comment
          { begin: /^\[\</, end: /\>\]$/, },        // F# class declaration?
          { begin: /<\//, end: />/, },              // HTML tags
          { begin: /^facet /, end: /\}/, },         // roboconf - лютый костыль )))
          { begin: '^1\\.\\.(\\d+)$', end: /$/, },  // tap  
        ],
        illegal: /./,
      },
      hljs.COMMENT('^#', '$'),
      QUOTE_STRING,
      APOS_STRING,
      VAR,
      { // attribute=value
        begin: /[\w-]+\=([^\s\{\}\[\]\(\)]+)/, 
        relevance: 0,
        returnBegin: true,
        contains: [
          {
            className: 'attribute',
            begin: /[^=]+/
          },
          {
            begin: /=/, 
            endsWithParent:  true,
            relevance: 0,
            contains: [
              QUOTE_STRING,
              APOS_STRING,
              VAR,
              {
                className: 'literal',
                begin: '\\b(' + LITERALS.split(' ').join('|') + ')\\b',
              },
              /*{
                // IPv4 addresses and subnets
                className: 'number',
                variants: [
                  {begin: IPADDR_wBITMASK+'(,'+IPADDR_wBITMASK+')*'}, //192.168.0.0/24,1.2.3.0/24
                  {begin: IPADDR+'-'+IPADDR},       // 192.168.0.1-192.168.0.3
                  {begin: IPADDR+'(,'+IPADDR+')*'}, // 192.168.0.1,192.168.0.34,192.168.24.1,192.168.0.1
                ]
              }, // */
              /*{
                // MAC addresses and DHCP Client IDs
                className: 'number',
                begin: /\b(1:)?([0-9A-Fa-f]{1,2}[:-]){5}([0-9A-Fa-f]){1,2}\b/,
              }, //*/
              {
                // Не форматировать не классифицированные значения. Необходимо для исключения подсветки значений как built_in.
                // className: 'number',  
                begin: /("[^"]*"|[^\s\{\}\[\]]+)/,
              }, //*/
            ]
          } //*/
        ]
      },//*/
      {
        // HEX values
        className: 'number',
        begin: /\*[0-9a-fA-F]+/,
      }, //*/

      { 
        begin: '\\b(' + COMMON_COMMANDS.split(' ').join('|') + ')([\\s\[\(]|\])',
        returnBegin: true,
        contains: [
          {
            className: 'builtin-name', //'function',
            begin: /\w+/,
          },
        ],  
      },
      
      { 
        className: 'built_in',
        variants: [
          {begin: '(\\.\\./|/|\\s)((' + OBJECTS.split(' ').join('|') + ');?\\s)+',relevance: 10,},
          {begin: /\.\./,},
        ],
      },//*/
    ]
  };
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/routeros.js"], null)
//# sourceMappingURL=/routeros.27d1ed20.map