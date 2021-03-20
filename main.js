"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var credentials = require("./credentials.json");
var Discord = require("discord.js");
var axios_1 = require("axios");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, prefix_1;
    return __generator(this, function (_a) {
        try {
            client = new Discord.Client(), prefix_1 = "dota.";
            client.once("ready", function () {
                console.log("DotaData is online!");
            });
            client.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                var commands, content, splitCommand, params, command, doCommand, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            commands = {
                                ping: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            try {
                                                msg.channel.send("pong");
                                            }
                                            catch (error) {
                                                console.error(error);
                                            }
                                            return [2 /*return*/];
                                        });
                                    });
                                },
                                winRate: function (limit) {
                                    if (limit === void 0) { limit = "30"; }
                                    return __awaiter(this, void 0, void 0, function () {
                                        var url, response, wr, error_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    url = "api.opendota.com/api/players/98240008/wl?limit=" + limit;
                                                    return [4 /*yield*/, axios_1["default"].get(url)];
                                                case 1:
                                                    response = _a.sent();
                                                    wr = response;
                                                    msg.channel.send(JSON.stringify(wr));
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    error_2 = _a.sent();
                                                    msg.channel.send("Error in winRate() " + error_2);
                                                    console.error("Error in winRate() " + error_2);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            };
                            // Setup
                            if (!msg.content.startsWith(prefix_1) || msg.author.bot)
                                return [2 /*return*/];
                            content = msg.content, splitCommand = content.split(prefix_1), params = void 0, command = void 0;
                            // Command and parameters
                            params = (_a = splitCommand === null || splitCommand === void 0 ? void 0 : splitCommand.pop()) === null || _a === void 0 ? void 0 : _a.split(" ");
                            command = params.shift();
                            doCommand = commands[command];
                            return [4 /*yield*/, params.length];
                        case 1:
                            (_b.sent()) ? doCommand.apply(void 0, params) : doCommand();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            console.error("Error in Event Emitter: " + error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Run bot
            client.login(credentials.token);
        }
        catch (error) {
            console.error("Error in main run: " + error);
        }
        return [2 /*return*/];
    });
}); })();