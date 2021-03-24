// Local resources
const credentials = require("./credentials.json");
import table from "./table";
// const base64 = require("./sandbox-base64.json");
// npm modules
import { Datastore } from "nedb-async-await";
import * as Discord from "discord.js";
import axios from "axios";
// Functions
// Main run
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
                let db = Datastore({
                    filename: "db.db",
                    autoload: true
                });
                await db.loadDatabase();
                let authorId = msg.author.id;
                let result = await db.findOne({ discordId: authorId });
                let server = "http://api.opendota.com/api/";
                // Mentions
                let mentions = msg.mentions ? msg.mentions.users.map((user, key) => key) : [];
                // Commands
                const commands = {
                    async ping() {
                        try {
                            msg.reply("pong");
                        } catch (error) {
                            console.error(error);
                        }
                    },
                    async userConfig(id:string) {
                        try {
                            // @ts-ignore
                            if(!id || isNaN(id))
                            throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                            let url = `${server}players/${id}`;
                            let response = await axios.get(url);
                            // @ts-ignore
                            if(response.error) throw response.error;
                            let playerData = response.data;
                            let channel = msg.channel.id;

                            if(result) {
                                await db.update(
                                    { _id: result._id },
                                    { $set: { steamId: id }, $addToSet: { channels: channel } },
                                    {}
                                );
                            } else {
                                await db.insert({
                                    discordId: authorId,
                                    steamId: id,
                                    channels: [channel]
                                });
                            }

                            msg.channel.send(`<@${msg.author}> successfully configured Steam account ${id} to Dota player ${playerData.profile.personaname}`);
                        } catch (error) {
                            msg.channel.send(`Error in userConfig() ${error}`);
                            console.error(`Error in userConfig() ${error}`);                            
                        }
                    },
                    async profile(id:string) {
                        try {
                            let response = await axios.get(`${server}players/${id}`);

                            return response.data;
                        } catch (error) {
                            console.error(`profiole() ${error}`)
                        }
                    },
                    async winrate(limit=30) {
                        try {
                            // discordId not found in database
                            if(!result)
                            throw new TypeError("Use dota.userConfig <steam id> to set up your account.");

                            let id:string;
                            let tag:string;
                            let tagged:any;
                            if(isNaN(limit)) limit = 30;
                            if(mentions.length) {
                                tag = mentions.shift()!;
                                tagged = await db.findOne({ discordId: tag });
                                id = tagged.steamId;
                                
                                console.log(tag, id, tagged);
                            } else {
                                id = result.steamId;
                                tag = msg.author.tag;
                            }
                            if(!result)
                            throw new TypeError(`No Dota account linked to @${tag}. Use dota.userConfig <steam id> to set up your account.`);
                            let url = `${server}players/${id}/wl?limit=${limit}`;
                            let response = await axios.get(url);
                            let wr = response.data;
                            let { win, lose } = wr;

                            limit > win + lose ? limit = win + lose : limit;

                            msg.reply(`${(100 * win / (win + lose)).toFixed(2)}% winrate for <@${tag}> from ${win} wins and ${lose} losses in the last ${limit} games.`);
                        } catch (error) {
                            msg.channel.send(`${error}`);
                            console.error(`Error in winRate() ${error} URL: ${server}${result.steamId}/wl?limit=${limit}`);
                        }
                    },
                    async kills(limit=30) {
                        try {
                            let id:string;
                            let tag:string;
                            let tagged:any;
                            let kills = 0, deaths = 0, assists = 0;
                            // discordId not found in database
                            if(!result)
                            throw new TypeError("Use dota.userConfig <steam id> to set up your account.");
                            if(isNaN(limit)) limit = 30;
                            if(limit > 100) limit = 100;
                            if(mentions.length) {
                                tag = mentions.shift()!;
                                tagged = await db.findOne({ discordId: tag });
                                id = tagged.steamId;
                            } else {
                                id = result.steamId;
                                tag = msg.author.id;
                            }
                            let url = `${server}players/${id}/matches?limit=${limit}`;
                            // API call
                            let response = await axios.get(url);
                            let matches = response.data;

                            matches.forEach((match:any) => {
                                kills += match.kills;
                                deaths += match.deaths;
                                assists += match.assists;
                            });

                            let profile = await commands.profile(id);

                            let msgEmbed = new Discord.MessageEmbed()
                                .setAuthor(`${profile.profile.personaname} (<@${tag}>)`, profile.profile.avatar, "")
                                .setDescription(`<@${tag}> KDA info for the last ${limit} matches.`)
                                .addFields(
                                    { name: 'Average KDR', value: (kills / deaths).toFixed(2) },
                                    { name: 'Kills', value: kills, inline: true },
                                    { name: 'Deaths', value: deaths, inline: true },
                                    { name: "Assists", value: assists, inline: true },
                                    { name: 'Kills Ave.', value: (kills / limit).toFixed(2), inline: true },
                                    { name: 'Deaths Ave.', value: (deaths / limit).toFixed(2), inline: true },
                                    { name: "Assists Ave.", value: (assists / limit).toFixed(2), inline: true }
                                )
                                .setTimestamp()
                                .setFooter(`Thank you for using DotaData!`, 'https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png');

                            msg.channel.send(msgEmbed);
                        } catch (error) {
                            msg.channel.send(`kills() ${error}`);
                            console.error(`kills() ${error}`);
                        }
                    },
                    async standings() {
                        try {
                            // const img = base64.img.split(",").pop();
                            const img = await table();
                            // @ts-ignore
                            const buf = new Buffer.from(img, "base64");
                            const msgEmbed = new Discord.MessageEmbed();

                            msgEmbed.attachFiles(buf);

                            msg.channel.send(msgEmbed);
                        } catch (error) {
                            msg.channel.send(`standings() ${error}`);
                            console.error(error);
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