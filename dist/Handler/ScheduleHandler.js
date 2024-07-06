import { CronJob } from "cron";
import { ReminderModel } from "../Database/reminder.js";
import { ZeitHandler } from "./ZeitHandler.js";
import { rest } from "../index.js";
export class ScheduleHandler {
    static startCronJob() {
        new CronJob('* * * * *', async () => {
            await this._run();
        }, null, true);
    }
    static async startUpRun() {
        await this._run();
    }
    static async _run() {
        const reminders = await ReminderModel.find();
        reminders.forEach(async (reminder) => await this.__run(reminder));
    }
    static async __run(reminder) {
        const created = Number.parseInt(reminder.reminderId);
        const reminderSetForData = reminder.lastExecuted === 0 ? ZeitHandler.AddTimeToDate(created, reminder.zeit) : new Date(reminder.lastExecuted);
        if (Date.now() > reminderSetForData.getTime()) {
            //do something because reminder is in the past and should be handeld
            const dmChannel = await rest.post("/users/@me/channels", {
                body: {
                    recipient_id: reminder.userId
                }
            });
            const msgData = {
                embeds: [
                    {
                        description: `Hey ich sollte die an was erinnern:
> ${reminder.name}`
                    }
                ]
            };
            await rest.post(`/channels/${dmChannel.id}/messages`, {
                body: msgData
            });
            if (reminder.repeat) {
                //set last executed
                await ReminderModel.findOneAndUpdate({
                    reminderId: reminder.reminderId,
                }, {
                    $set: {
                        lastExecuted: Date.now()
                    }
                });
            }
            else {
                //delete reminder
                await ReminderModel.deleteOne({
                    reminderId: reminder.reminderId,
                });
            }
        }
    }
}
