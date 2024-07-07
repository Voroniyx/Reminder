import {
    APIButtonComponentWithCustomId, APIInteractionResponseCallbackData,
    APIMessageComponentButtonInteraction,
    ButtonStyle,
    ComponentType
} from "discord-api-types/v10";
import {ReminderModel} from "../Database/reminder.js";
import {ColorHandler} from "../Handler/ColorHandler.js";
import {getSettingsOrCreateOne} from "../Database/settings.js";
import {lang} from "../index.js";

export class DeleteReminder {
    public static getButtonData(reminderId: string, langCode:string): APIButtonComponentWithCustomId {
        return {
            type: ComponentType.Button,
            custom_id: `button:reminder:delete:${reminderId}`,
            style: ButtonStyle.Primary,
            label: lang.get("reminder.button.title", langCode),
        }
    }

    public static async execute(data: APIMessageComponentButtonInteraction):Promise<APIInteractionResponseCallbackData> {
        const reminderId = data.data.custom_id.split(":")[3];
        const reminder = ReminderModel.findOne({reminderId: reminderId});
        const userId = data.user.id;
        const userSettings = await getSettingsOrCreateOne(userId);

        if(!reminder) {
            return {
                embeds: [
                    {
                        color:ColorHandler.get("Red"),
                        description: lang.get("reminder.button.delete.fail",userSettings.lang)
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
                        description: lang.get("reminder.button.delete.success",userSettings.lang)
                    }
                ]
            }
        } else {
            return {
                embeds: [
                    {
                        color:ColorHandler.get("Red"),
                        description: lang.get("reminder.button.delete.fail",userSettings.lang)
                    }
                ]
            }
        }
    }
}