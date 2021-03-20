const credentials = require("./credentials.json");
import * as Discord from "discord.js";
import axios from "axios";

(async () => {
    try {
        const client = new Discord.Client(),
            prefix = "dota.";
        client.once("ready", () => {
            console.log("DotaData is online!");
        });
        client.on("message", async msg => {
            try {
                // Commands
                const commands = {
                    async ping() {
                        try {
                            msg.channel.send("pong");
                        } catch (error) {
                            console.error(error);
                        }
                    },
                    async winRate(limit="30") {
                        try {
                            let url = `api.opendota.com/api/players/98240008/wl?limit=${limit}`;
                            let response = await axios.get(url);
                            let wr = response;

                            msg.channel.send(JSON.stringify(wr));
                        } catch (error) {
                            msg.channel.send(`Error in winRate() ${error}`);
                            console.error(`Error in winRate() ${error}`);
                        }
                    }
                }
                // Setup
                if(!msg.content.startsWith(prefix) || msg.author.bot) return;
                // Variables
                let content:string = msg.content,
                    splitCommand:string[] = content.split(prefix),
                    params:string[], command;
                // Command and parameters
                params = splitCommand?.pop()?.split(" ")!;
                command = params.shift();
                // @ts-ignore
                let doCommand = commands[command];
                await params.length ? doCommand(...params) : doCommand();
            } catch (error) {
                console.error(`Error in Event Emitter: ${error}`);
            }
        });
        // Run bot
        client.login(credentials.token);
    } catch (error) {
        console.error(`Error in main run: ${error}`);
    }
})();