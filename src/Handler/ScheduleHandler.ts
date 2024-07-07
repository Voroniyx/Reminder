import {CronJob} from "cron";
import {Reminder, ReminderModel} from "../Database/reminder.js";
import {ZeitHandler} from "./ZeitHandler.js";
import {lang, rest} from "../index.js";
import {
    APIActionRowComponent,
    APIDMChannel,
    APIMessageActionRowComponent,
    ComponentType,
    RESTPostAPIChannelMessageJSONBody
} from "discord-api-types/v10";
import {ColorHandler} from "./ColorHandler.js";
import {DeleteReminder} from "../Button/DeleteReminder.js";
import {getSettingsOrCreateOne} from "../Database/settings.js";

export class ScheduleHandler {
    public static startCronJob() {
        new CronJob(
            '* * * * *',
            async () => {
                await this._run();
            },
            null,
            true,
        );
    }

    public static async startUpRun() {
        await this._run();
    }

    private static async _run() {
        const reminders = await ReminderModel.find();

        reminders.forEach(async (reminder) => await this.__run(reminder))
    }

    private static async __run(reminder: Reminder) {
        const reminderSetForData = reminder.lastExecuted === 0 ? ZeitHandler.AddTimeToDate(reminder.created, reminder.zeit) : new Date(reminder.lastExecuted);

        const settings = await getSettingsOrCreateOne(reminder.userId);

        if (Date.now() > reminderSetForData.getTime()) {

            //do something because reminder is in the past and should be handled
            const dmChannel = await rest.post("/users/@me/channels", {
                body: {
                    recipient_id: reminder.userId
                }
            }) as APIDMChannel

            //TODO Button hinzufügen der den reminder löscht wenn er auf repeat steht

            const components:APIActionRowComponent<APIMessageActionRowComponent>[] = [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        DeleteReminder.getButtonData(reminder.reminderId, settings.lang)
                    ]
                }
            ]

            const msgData: RESTPostAPIChannelMessageJSONBody = {
                components: reminder.repeat ? components : [],
                embeds: [
                    {
                        description: `${lang.get("reminder.scheduler.execute.description", settings.lang)}
> ${reminder.name}`,
                        color: ColorHandler.get("Green")
                    }
                ]
            }

            await rest.post(`/channels/${dmChannel.id}/messages`, {
                body: msgData
            })

            if (reminder.repeat) {
                await ReminderModel.findOneAndUpdate({
                    reminderId: reminder.reminderId,
                }, {
                    $set: {
                        lastExecuted: Date.now()
                    }
                })
            } else {
                //delete reminder
                await ReminderModel.deleteOne({
                    reminderId: reminder.reminderId,
                })
            }
        }
    }
}