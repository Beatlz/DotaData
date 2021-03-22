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
// Local resources
var credentials = require("./credentials.json");
// npm modules
var nedb_async_await_1 = require("nedb-async-await");
var Discord = require("discord.js");
var axios_1 = require("axios");
// Main run
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, prefix_1;
    return __generator(this, function (_a) {
        try {
            client = new Discord.Client(), prefix_1 = "dota.";
            client.once("ready", function () {
                console.log("DotaData is online!");
            });
            client.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                var db_1, authorId_1, result_1, server_1, mentions_1, commands_1, content, splitCommand, params, command, doCommand, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            // Setup
                            if (!msg.content.startsWith(prefix_1) || msg.author.bot)
                                return [2 /*return*/];
                            db_1 = nedb_async_await_1.Datastore({
                                filename: "db.db",
                                autoload: true
                            });
                            return [4 /*yield*/, db_1.loadDatabase()];
                        case 1:
                            _b.sent();
                            authorId_1 = msg.author.id;
                            return [4 /*yield*/, db_1.findOne({ discordId: authorId_1 })];
                        case 2:
                            result_1 = _b.sent();
                            server_1 = "http://api.opendota.com/api/";
                            mentions_1 = msg.mentions ? msg.mentions.users.map(function (user, key) { return key; }) : [];
                            commands_1 = {
                                ping: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            try {
                                                msg.reply("pong");
                                            }
                                            catch (error) {
                                                console.error(error);
                                            }
                                            return [2 /*return*/];
                                        });
                                    });
                                },
                                userConfig: function (id) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var url, response, playerData, channel, error_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 6, , 7]);
                                                    // @ts-ignore
                                                    if (!id || isNaN(id))
                                                        throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                                                    url = server_1 + "players/" + id;
                                                    return [4 /*yield*/, axios_1["default"].get(url)];
                                                case 1:
                                                    response = _a.sent();
                                                    // @ts-ignore
                                                    if (response.error)
                                                        throw response.error;
                                                    playerData = response.data;
                                                    channel = msg.channel.id;
                                                    if (!result_1) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, db_1.update({ _id: result_1._id }, { $set: { steamId: id }, $addToSet: { channels: channel } }, {})];
                                                case 2:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 3: return [4 /*yield*/, db_1.insert({
                                                        discordId: authorId_1,
                                                        steamId: id,
                                                        channels: [channel]
                                                    })];
                                                case 4:
                                                    _a.sent();
                                                    _a.label = 5;
                                                case 5:
                                                    msg.channel.send("<@" + msg.author + "> successfully configured Steam account " + id + " to Dota player " + playerData.profile.personaname);
                                                    return [3 /*break*/, 7];
                                                case 6:
                                                    error_2 = _a.sent();
                                                    msg.channel.send("Error in userConfig() " + error_2);
                                                    console.error("Error in userConfig() " + error_2);
                                                    return [3 /*break*/, 7];
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                                profile: function (id) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var response, error_3;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, axios_1["default"].get(server_1 + "players/" + id)];
                                                case 1:
                                                    response = _a.sent();
                                                    return [2 /*return*/, response.data];
                                                case 2:
                                                    error_3 = _a.sent();
                                                    console.error("profiole() " + error_3);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                                winrate: function (limit) {
                                    if (limit === void 0) { limit = 30; }
                                    return __awaiter(this, void 0, void 0, function () {
                                        var id, tag, tagged, url, response, wr, win, lose, error_4;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 5, , 6]);
                                                    // discordId not found in database
                                                    if (!result_1)
                                                        throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                                                    id = void 0;
                                                    tag = void 0;
                                                    tagged = void 0;
                                                    if (isNaN(limit))
                                                        limit = 30;
                                                    if (!mentions_1.length) return [3 /*break*/, 2];
                                                    tag = mentions_1.shift();
                                                    return [4 /*yield*/, db_1.findOne({ discordId: tag })];
                                                case 1:
                                                    tagged = _a.sent();
                                                    id = tagged.steamId;
                                                    console.log(tag, id, tagged);
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    id = result_1.steamId;
                                                    tag = msg.author.tag;
                                                    _a.label = 3;
                                                case 3:
                                                    if (!result_1)
                                                        throw new TypeError("No Dota account linked to @" + tag + ". Use dota.userConfig <steam id> to set up your account.");
                                                    url = server_1 + "players/" + id + "/wl?limit=" + limit;
                                                    return [4 /*yield*/, axios_1["default"].get(url)];
                                                case 4:
                                                    response = _a.sent();
                                                    wr = response.data;
                                                    win = wr.win, lose = wr.lose;
                                                    limit > win + lose ? limit = win + lose : limit;
                                                    msg.reply((100 * win / (win + lose)).toFixed(2) + "% winrate for <@" + tag + "> from " + win + " wins and " + lose + " losses in the last " + limit + " games.");
                                                    return [3 /*break*/, 6];
                                                case 5:
                                                    error_4 = _a.sent();
                                                    msg.channel.send("" + error_4);
                                                    console.error("Error in winRate() " + error_4 + " URL: " + server_1 + result_1.steamId + "/wl?limit=" + limit);
                                                    return [3 /*break*/, 6];
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                                kills: function (limit) {
                                    if (limit === void 0) { limit = 30; }
                                    return __awaiter(this, void 0, void 0, function () {
                                        var id, tag, tagged, kills_1, deaths_1, assists_1, url, response, matches, profile_1, msgEmbed, error_5;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 6, , 7]);
                                                    id = void 0;
                                                    tag = void 0;
                                                    tagged = void 0;
                                                    kills_1 = 0, deaths_1 = 0, assists_1 = 0;
                                                    // discordId not found in database
                                                    if (!result_1)
                                                        throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                                                    if (isNaN(limit))
                                                        limit = 30;
                                                    if (limit > 100)
                                                        limit = 100;
                                                    if (!mentions_1.length) return [3 /*break*/, 2];
                                                    tag = mentions_1.shift();
                                                    return [4 /*yield*/, db_1.findOne({ discordId: tag })];
                                                case 1:
                                                    tagged = _a.sent();
                                                    id = tagged.steamId;
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    id = result_1.steamId;
                                                    tag = msg.author.id;
                                                    _a.label = 3;
                                                case 3:
                                                    url = server_1 + "players/" + id + "/matches?limit=" + limit;
                                                    return [4 /*yield*/, axios_1["default"].get(url)];
                                                case 4:
                                                    response = _a.sent();
                                                    matches = response.data;
                                                    matches.forEach(function (match) {
                                                        kills_1 += match.kills;
                                                        deaths_1 += match.deaths;
                                                        assists_1 += match.assists;
                                                    });
                                                    return [4 /*yield*/, commands_1.profile(id)];
                                                case 5:
                                                    profile_1 = _a.sent();
                                                    msgEmbed = new Discord.MessageEmbed()
                                                        .setAuthor(profile_1.profile.personaname + " (" + msg.author.username + ")", profile_1.profile.avatar, "")
                                                        .setDescription("<@" + tag + "> KDA info for the last " + limit + " matches.")
                                                        .addFields({ name: 'Average KDR', value: (kills_1 / deaths_1).toFixed(2) }, { name: 'Kills', value: kills_1, inline: true }, { name: 'Deaths', value: deaths_1, inline: true }, { name: "Assists", value: assists_1, inline: true }, { name: 'Kills Ave.', value: (kills_1 / limit).toFixed(2), inline: true }, { name: 'Deaths Ave.', value: (deaths_1 / limit).toFixed(2), inline: true }, { name: "Assists Ave.", value: (assists_1 / limit).toFixed(2), inline: true })
                                                        .setTimestamp()
                                                        .setFooter("Thank you for using DotaData!", 'https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png');
                                                    msg.channel.send(msgEmbed);
                                                    return [3 /*break*/, 7];
                                                case 6:
                                                    error_5 = _a.sent();
                                                    msg.channel.send("kills() " + error_5);
                                                    console.error("kills() " + error_5);
                                                    return [3 /*break*/, 7];
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                                standings: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var exampleEmbed;
                                        return __generator(this, function (_a) {
                                            try {
                                                exampleEmbed = {
                                                    color: 0x0099ff,
                                                    title: 'Some title',
                                                    url: 'https://discord.js.org',
                                                    author: {
                                                        name: 'Some name',
                                                        icon_url: 'https://i.imgur.com/wSTFkRM.png',
                                                        url: 'https://discord.js.org'
                                                    },
                                                    description: 'Some description here',
                                                    thumbnail: {
                                                        url: 'https://i.imgur.com/wSTFkRM.png'
                                                    },
                                                    fields: [
                                                        {
                                                            name: 'Regular field title',
                                                            value: 'Some value here'
                                                        },
                                                        {
                                                            name: '\u200b',
                                                            value: '\u200b',
                                                            inline: false
                                                        },
                                                        {
                                                            name: 'Inline field title',
                                                            value: '1',
                                                            inline: true
                                                        },
                                                        {
                                                            name: 'Inline field title',
                                                            value: '2',
                                                            inline: true
                                                        },
                                                        {
                                                            name: 'Inline field title',
                                                            value: '3',
                                                            inline: true
                                                        },
                                                        {
                                                            name: 'Inline field title',
                                                            value: '4',
                                                            inline: true
                                                        }
                                                    ],
                                                    image: {
                                                        url: 'https://i.imgur.com/wSTFkRM.png'
                                                    },
                                                    timestamp: new Date(),
                                                    footer: {
                                                        text: 'Some footer text here',
                                                        icon_url: 'https://i.imgur.com/wSTFkRM.png'
                                                    }
                                                };
                                                msg.channel.send({ embed: exampleEmbed });
                                            }
                                            catch (error) {
                                                msg.channel.send("standings() " + error);
                                                console.error(error);
                                            }
                                            return [2 /*return*/];
                                        });
                                    });
                                }
                            };
                            content = msg.content, splitCommand = content.split(prefix_1), params = void 0, command = void 0;
                            // Command and parameters
                            params = (_a = splitCommand === null || splitCommand === void 0 ? void 0 : splitCommand.pop()) === null || _a === void 0 ? void 0 : _a.split(" ");
                            command = params.shift();
                            // @ts-ignore
                            if (!commands_1[command])
                                throw new TypeError("Command " + command + " doesn't exist. Available commands are " + Object.keys(commands_1));
                            doCommand = commands_1[command];
                            return [4 /*yield*/, params.length];
                        case 3:
                            (_b.sent()) ? doCommand.apply(void 0, params) : doCommand();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            msg.channel.send("Error: " + error_1);
                            console.error("Error in Event Emitter: " + error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
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
