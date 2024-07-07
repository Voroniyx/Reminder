import {ICommand} from "../types/types.js";
import {Response} from "express";
import {
    APIChatInputApplicationCommandDMInteraction, APIChatInputApplicationCommandGuildInteraction,
    APIInteractionResponse,
    InteractionResponseType,
    MessageFlags
} from "discord-api-types/v10";
import {Reminder} from "../Commands/Reminder";
import {rest} from "../index.js";

export class CommandHandler {
    public static async install(commands: ICommand[]) {
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

        //Execute the command and get the msg data
        const commandResponse = await Reminder.execute(body);

        //Update the msg with the commandResponse
        await rest.patch(
            `/webhooks/${body.application_id}/${body.token}/messages/@original`,
            {
                body: commandResponse,
            }
        );
    }
}