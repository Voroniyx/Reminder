import {Response} from "express";
import {
    APIInteractionResponse,
    APIMessageComponentButtonInteraction,
    InteractionResponseType,
    MessageFlags
} from "discord-api-types/v10";
import {rest} from "../index.js";
import {DeleteReminder} from "../Button/DeleteReminder.js";

export class ButtonHandler {
    public static async processButton(body: APIMessageComponentButtonInteraction, res: Response<APIInteractionResponse>) {
        //Defer the interaction and mark as ephemeral
        res.json({
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
            },
        });

        //Execute the command and get the msg data
        const buttonResponse = await DeleteReminder.execute(body);

        //Update the msg with the commandResponse
        await rest.patch(
            `/webhooks/${body.application_id}/${body.token}/messages/@original`,
            {
                body: buttonResponse,
            }
        );
    }
}