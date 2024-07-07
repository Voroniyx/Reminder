import * as dotenv from "dotenv";

dotenv.config();

import {Reminder} from './Commands/Reminder.js'
import {CommandHandler} from "./Handler/CommandHandler.js";
import {Settings} from "./Commands/Settings.js";

(async () => {
    await CommandHandler.install([
        Reminder.GetCommandData(),
        Settings.GetCommandData()
    ])
})();