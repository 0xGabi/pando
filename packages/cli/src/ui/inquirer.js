"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = __importStar(require("inquirer"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var web3_1 = __importDefault(require("web3"));
exports.questions = {
    /* tslint:disable:object-literal-sort-keys */
    signer: {
        name: 'type',
        type: 'list',
        message: 'Account type',
        choices: ['Unlocked account', 'HD wallet / mnemonic']
    },
    mnemonic: {
        name: 'words',
        type: 'input',
        message: 'Mnemonic: '
    },
    ethereum: {
        name: 'ethereum.gateway',
        type: 'input',
        message: 'Ethereum node URL: ',
        default: 'http://localhost:8545',
        validate: function (value) { return __awaiter(_this, void 0, void 0, function () {
            var regex, provider, web3, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/);
                        if (!value.match(regex)) return [3 /*break*/, 5];
                        provider = new web3_1.default.providers.HttpProvider(value);
                        web3 = new web3_1.default(provider);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, web3.eth.getAccounts()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, 'Unable to connect to ' + value];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, 'Invalid URL'];
                    case 6: return [2 /*return*/];
                }
            });
        }); }
    },
    /* tslint:disable:object-literal-sort-keys */
    ipfs: {
        name: 'ipfs.gateway',
        type: 'input',
        message: 'IPFS node URL: ',
        default: 'http://localhost:5001',
        validate: function (value) { return __awaiter(_this, void 0, void 0, function () {
            var regex;
            return __generator(this, function (_a) {
                regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/);
                if (value.match(regex)) {
                    return [2 /*return*/, true];
                }
                else {
                    return [2 /*return*/, 'Invalid URL'];
                }
                return [2 /*return*/];
            });
        }); }
    },
    author: function (provider) { return __awaiter(_this, void 0, void 0, function () {
        var question;
        var _this = this;
        return __generator(this, function (_a) {
            question = {
                name: 'author.account',
                type: 'list',
                message: 'Account: ',
                choices: function () { return __awaiter(_this, void 0, void 0, function () {
                    var web3, accounts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                web3 = new web3_1.default(provider);
                                return [4 /*yield*/, web3.eth.getAccounts()];
                            case 1:
                                accounts = _a.sent();
                                return [2 /*return*/, accounts];
                        }
                    });
                }); },
                default: 0
            };
            return [2 /*return*/, question];
        });
    }); }
};
exports.prompt = {
    configure: function () { return __awaiter(_this, void 0, void 0, function () {
        var provider, author, ipfs, ethereum, signer, _a, _b, mnemonic, _c, _d, web3, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    author = { author: { account: '' } };
                    return [4 /*yield*/, inquirer.prompt(exports.questions.ipfs)];
                case 1:
                    ipfs = _f.sent();
                    return [4 /*yield*/, inquirer.prompt(exports.questions.ethereum)];
                case 2:
                    ethereum = _f.sent();
                    return [4 /*yield*/, inquirer.prompt(exports.questions.signer)];
                case 3:
                    signer = _f.sent();
                    if (!(signer.type === 'Unlocked account')) return [3 /*break*/, 6];
                    provider = new web3_1.default.providers.HttpProvider(ethereum.gateway);
                    _b = (_a = inquirer).prompt;
                    return [4 /*yield*/, exports.questions.author(provider)];
                case 4: return [4 /*yield*/, _b.apply(_a, [_f.sent()])];
                case 5:
                    author = _f.sent();
                    return [3 /*break*/, 10];
                case 6:
                    if (!(signer.type === 'HD wallet / mnemonic')) return [3 /*break*/, 10];
                    _d = (_c = inquirer).prompt;
                    return [4 /*yield*/, exports.questions.mnemonic];
                case 7: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                case 8:
                    mnemonic = _f.sent();
                    ethereum.ethereum.mnemonic = mnemonic.words;
                    provider = new truffle_hdwallet_provider_1.default(mnemonic.words, ethereum.gateway);
                    web3 = new web3_1.default(provider);
                    _e = author.author;
                    return [4 /*yield*/, web3.eth.getAccounts()];
                case 9:
                    _e.account = (_f.sent())[0];
                    _f.label = 10;
                case 10: return [2 /*return*/, __assign({}, author, ethereum, ipfs)];
            }
        });
    }); }
};
/* tslint:enable:object-literal-sort-keys */
exports.default = exports.prompt;
