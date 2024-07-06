import {CronJob} from "cron";
import {Reminder, ReminderModel} from "../Database/reminder.js";
import {ZeitHandler} from "./ZeitHandler.js";
import {rest} from "../index.js";
import {APIDMChannel, RESTPostAPIChannelMessageJSONBody} from "discord-api-types/v10";

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

        console.log(reminderSetForData.toISOString());

        if (Date.now() > reminderSetForData.getTime()) {

            console.log("im if");

            //do something because reminder is in the past and should be handeled
            const dmChannel = await rest.post("/users/@me/channels", {
                body: {
                    recipient_id: reminder.userId
                }
            }) as APIDMChannel

            const msgData: RESTPostAPIChannelMessageJSONBody = {
                embeds: [
                    {
                        description: `Hey ich sollte die an was erinnern:
> ${reminder.name}`
                    }
                ]
            }

            await rest.post(`/channels/${dmChannel.id}/messages`, {
                body: msgData
            })

            if (reminder.repeat) {
                console.log("reminder auf repeat");
                //set last executed

                //TODO Button hinzufügen der den reminder löscht wenn er auf repeat steht

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
                console.log("reminder wurde gelöscht");
            }
        }
    }
}