import * as dotenv from "dotenv";
dotenv.config();

import {Reminder} from './Commands/Reminder'
import {CommandHandler} from "./Handler/CommandHandler.js";

(async () => {
    await CommandHandler.install([Reminder.GetCommandData()])
})();