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
var commands = __importStar(require("./commands"));
var argv = yargs_1.default
    .usage('pando <command>')
    .command(commands.configure)
    .command(commands.init)
    .command(commands.stage)
    .command(commands.snapshot)
    .command(commands.fetch)
    .command(commands.push)
    .command(commands.pull)
    .command(commands.status)
    .command(commands.log)
    .command(commands.branch)
    .command(commands.remote)
    .command(commands.clone)
    .demandCommand(1, 'No command provided')
    .strict()
    .help()
    .alias('h', 'help').argv;
