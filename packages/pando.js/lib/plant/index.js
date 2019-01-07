"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var factory_1 = __importDefault(require("./organization/factory"));
var factory_2 = __importDefault(require("./fiber/factory"));
var ipfs_http_client_1 = __importDefault(require("ipfs-http-client"));
var Plant = /** @class */ (function () {
    function Plant(pando, path, node) {
        if (path === void 0) { path = '.'; }
        this.pando = pando;
        this.paths = {
            root: path,
            pando: path_1.default.join(path, '.pando'),
            ipfs: path_1.default.join(path, '.pando', 'ipfs'),
            organizations: path_1.default.join(path, '.pando', 'organizations'),
            fibers: path_1.default.join(path, '.pando', 'fibers')
        };
        this.node = node;
        this.organizations = new factory_1.default(this);
        this.fibers = new factory_2.default(this);
    }
    Plant.prototype.publish = function (organizationName, organismName, message) {
        if (message === void 0) { message = 'n/a'; }
        return __awaiter(this, void 0, void 0, function () {
            var fiber, snapshot, metadata, lineage, cid, individuation, organization, address, peer, gateway, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fibers.current()];
                    case 1:
                        fiber = _a.sent();
                        return [4 /*yield*/, fiber.snapshot('Automatic snapshot before RFI')];
                    case 2:
                        snapshot = _a.sent();
                        metadata = {
                            tree: snapshot.tree,
                            message: message
                        };
                        lineage = {
                            destination: this.pando.options.ethereum.account,
                            minimum: 0,
                            metadata: ''
                        };
                        return [4 /*yield*/, this.node.dag.put(metadata, { format: 'dag-cbor', hashAlg: 'sha3-512' })];
                    case 3:
                        cid = (_a.sent()).toBaseEncodedString();
                        individuation = {
                            metadata: cid
                        };
                        return [4 /*yield*/, this.organizations.load({ name: organizationName })];
                    case 4:
                        organization = _a.sent();
                        return [4 /*yield*/, organization.organisms.address(organismName)];
                    case 5:
                        address = _a.sent();
                        return [4 /*yield*/, this.node.start()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.node.id()];
                    case 7:
                        peer = _a.sent();
                        gateway = ipfs_http_client_1.default({ host: 'localhost', port: '5001', protocol: 'http' });
                        return [4 /*yield*/, gateway.swarm.connect('/ip4/127.0.0.1/tcp/4003/ws/ipfs/' + peer.id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, gateway.pin.add(cid)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, gateway.pin.add(snapshot.tree)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.node.stop()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, organization.scheme.createRFI(address, individuation, [lineage])];
                    case 12:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    Plant.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.fibers.db.isOpen()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fibers.db.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.organizations.db.isOpen()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.organizations.db.close()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fs_extra_1.default.removeSync(this.paths.pando);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Plant;
}());
exports.default = Plant;
//# sourceMappingURL=index.js.map