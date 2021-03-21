const credentials = require("./credentials.json");
var users = require("./users.json");

import * as Discord from "discord.js";
import axios from "axios";
import * as fs from "fs";

(async () => {
    try {
        const client = new Discord.Client(),
            prefix = "dota.";
        client.once("ready", () => {
            console.log("DotaData is online!");
        });
        client.on("message", async msg => {
            try {
                // Setup
                if(!msg.content.startsWith(prefix) || msg.author.bot) return;
                // Mentions
                let mentions = msg.mentions ? msg.mentions.users.map((user, key) => key) : [];
                // Commands
                const commands = {
                    async ping() {
                        try {
                            msg.channel.send("pong");
                        } catch (error) {
                            console.error(error);
                        }
                    },
                    async winrate(limit=30) {
                        try {
                            let id:string;
                            let tag:string;
                            if(isNaN(limit)) limit = 30;
                            if(mentions.length) {
                                id = mentions.shift()!;
                                tag = msg.mentions.users.get(id)!.tag;
                            } else {
                                id = msg.author.id;
                                tag = msg.author.tag;
                            }
                            if(!users[id!])
                            throw new TypeError(`No Dota account linked to @${tag}. Use dota.userConfig <steam id> to set up your account.`);
                            let url = `http://api.opendota.com/api/players/${users[id]}/wl?limit=${limit}`;
                            let response = await axios.get(url);
                            let wr = response.data;
                            let { win, lose } = wr;

                            msg.channel.send(`${Math.round(100 * win / (win + lose))}% winrate for @${tag} from ${win} wins and ${lose} losses in the last ${limit} games.`);
                        } catch (error) {
                            msg.channel.send(`${error}`);
                            console.error(`Error in winRate() ${error}`);
                        }
                    },
                    async userConfig(id:string) {
                        try {
                            if(!id || isNaN(id?))
                            throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                            let authorId = msg.author.id;
                            users[authorId] = id;
                            let url = `http://api.opendota.com/api/players/${id}`;
                            let response = await axios.get(url);
                            // @ts-ignore
                            if(response.error) throw response.error;
                            let playerData = response.data;
                            await fs.writeFile("users.json", JSON.stringify(users), err => {
                                if(err) throw err;
                                msg.channel.send(`@${msg.author.tag} successfully configured Steam account ${id} to Dota player ${playerData.profile.personaname}`);
                            });
                        } catch (error) {
                            msg.channel.send(`Error in userConfig() ${error}`);
                            console.error(`Error in userConfig() ${error}`);                            
                        }
                    },
                    async kills(limit=10) {
                        try {
                            
                        } catch (error) {
                            
                        }
                    }
                }
                // Variables
                let content:string = msg.content,
                    splitCommand:string[] = content.split(prefix),
                    params:string[], command;
                // Command and parameters
                params = splitCommand?.pop()?.split(" ")!;
                command = params.shift();
                // @ts-ignore
                if(!commands[command])
                throw new TypeError(`Command ${command} doesn't exist. Available commands are ${Object.keys(commands)}`);
                // @ts-ignore
                let doCommand = commands[command];
                await params.length ? doCommand(...params) : doCommand();
            } catch (error) {
                msg.channel.send(`Error: ${error}`);
                console.error(`Error in Event Emitter: ${error}`);
            }
        });
        // Run bot
        client.login(credentials.token);
    } catch (error) {
        console.error(`Error in main run: ${error}`);
    }
})();