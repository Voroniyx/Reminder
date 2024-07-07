import {
    APIButtonComponentWithCustomId, APIInteractionResponseCallbackData,
    APIMessageComponentButtonInteraction,
    ButtonStyle,
    ComponentType
} from "discord-api-types/v10";
import {ReminderModel} from "../Database/reminder.js";
import {ColorHandler} from "../Handler/ColorHandler.js";

export class DeleteReminder {
    public static getButtonData(reminderId: string): APIButtonComponentWithCustomId {
        return {
            type: ComponentType.Button,
            custom_id: `button:reminder:delete:${reminderId}`,
            style: ButtonStyle.Primary,
            label: 'Erinnerung löschen',
        }
    }

    public static async execute(data: APIMessageComponentButtonInteraction):Promise<APIInteractionResponseCallbackData> {
        const reminderId = data.data.custom_id.split(":")[3];
        const reminder = ReminderModel.findOne({reminderId: reminderId});
        if(!reminder) {
            return {
                embeds: [
                    {
                        color:ColorHandler.get("Red"),
                        description: "Ich konnte den Reminder nicht löschen. Bitte probiere es erneut."
                    }
                ]
            }
        }

        const deleteResult = await ReminderModel.deleteOne({reminderId: reminderId})

        if(deleteResult.deletedCount > 0) {
            return {
                embeds: [
                    {
                        color:ColorHandler.get("Green"),
                        description: "Ich habe deinen Reminder gelöscht."
                    }
                ]
            }
        } else {
            return {
                embeds: [
                    {
                        color:ColorHandler.get("Red"),
                        description: "Ich konnte den Reminder nicht löschen. Bitte probiere es erneut."
                    }
                ]
            }
        }
    }
}