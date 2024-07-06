import * as dotenv from "dotenv";
dotenv.config();
import { Reminder } from './Commands/reminder.js';
import { CommandHandler } from "./Handler/CommandHandler.js";
(async () => {
    await CommandHandler.install([Reminder.GetCommandData()]);
})();
