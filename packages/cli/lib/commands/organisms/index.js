"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var subcommands = __importStar(require("./subcommands"));
var builder = function () {
    return yargs_1.default
        .usage('pando organisms <subcommand>')
        .command(subcommands.list)
        .command(subcommands.deploy)
        .command(subcommands.add)
        .updateStrings({ 'Commands:': 'Subcommands:' })
        .demandCommand(1, 'No subcommand provided')
        .strict()
        .help()
        .version(false);
};
/* tslint:disable:object-literal-sort-keys */
exports.organisms = {
    command: 'organisms <subcommand>',
    desc: 'Handle organisms',
    builder: builder,
};
/* tslint:enable:object-literal-sort-keys */
//# sourceMappingURL=index.js.map