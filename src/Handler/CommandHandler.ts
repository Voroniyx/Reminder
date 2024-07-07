import {ICommand} from "../types/types.js";
import {Response} from "express";
import {
    APIChatInputApplicationCommandDMInteraction, APIChatInputApplicationCommandGuildInteraction,
    APIInteractionResponse,
    InteractionResponseType,
    MessageFlags
} from "discord-api-types/v10";
import {Reminder} from "../Commands/Reminder.js";
import {rest} from "../index.js";
import {Settings} from "../Commands/Settings.js";

export class CommandHandler {
    public static async install(commands: ICommand[]) {
        console.log("Deploying Commands");

        const url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/commands`;

        let formatedCommands: string = "";
        if (commands) formatedCommands = JSON.stringify(commands);

        const res = await fetch(url, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent':
                    `Reminder (${process.env.APP_ID}, 1.0.0)`,
            },
            method: 'PUT',
            body: formatedCommands,
        });

        // throw API errors
        if (!res.ok) {
            const data = await res.json();
            console.log(res.status);
            throw new Error(JSON.stringify(data));
        }
        console.log("Deploying commands successful");

        // return original response
        return res;
    }

    public static async processCommand(body: APIChatInputApplicationCommandGuildInteraction | APIChatInputApplicationCommandDMInteraction, res: Response<APIInteractionResponse>) {
        //Defer the interaction and mark as ephemeral
        res.json({
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
            },
        });

        let commandResponse = {};

        switch (body.data.name) {
            case 'settings': {
                commandResponse = await Settings.execute(body);
                break;
            }
            case 'reminder': {
                commandResponse = await Reminder.execute(body);
                break;
            }
        }

        //Update the msg with the commandResponse
        await rest.patch(
            `/webhooks/${body.application_id}/${body.token}/messages/@original`,
            {
                body: commandResponse,
            }
        );
    }
}