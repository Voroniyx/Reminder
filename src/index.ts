import * as dotenv from "dotenv";
import express from 'express';
import {InteractionResponseType, verifyKeyMiddleware} from 'discord-interactions';
import {InteractionType} from "discord-api-types/v10";
import {Reminder} from "./Commands/Reminder";
import {BodyType} from "./types/types.js";
import {CommandHandler} from "./Handler/CommandHandler.js";
import {REST} from "@discordjs/rest";
import {connect, set} from "mongoose";
import {ScheduleHandler} from "./Handler/ScheduleHandler.js";
import {ButtonHandler} from "./Handler/ButtonHandler";

dotenv.config();

export const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);


set('strictQuery', true);
await connect(process.env.MONGO_TOKEN).then(() => console.log('[Database] Successfully Connected and Loaded Database'));

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
// app.use(express.json({verify: VerifyDiscordRequest.run}));

app.get("/", (_, res) => {res.sendStatus(200)});

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_CLIENT_KEY), async function (req, res) {
    // Interaction type and data
    const body = req.body as BodyType;

    switch (body.type) {
        case InteractionType.Ping: {
            return res.send({type: InteractionResponseType.PONG});
        }

        case InteractionType.ApplicationCommand: {
            return await CommandHandler.processCommand(body, res)
        }

        case InteractionType.ApplicationCommandAutocomplete: {
            return await Reminder.autoComplete(body, res)
        }

        case InteractionType.MessageComponent: {
            return await ButtonHandler.processButton(body, res);
        }

        default: {
            return res.sendStatus(401);
        }
    }
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});

ScheduleHandler.startUpRun().then(() => console.log("ScheduleHandler startup run"));
ScheduleHandler.startCronJob()

process.on("unhandledRejection", async (reason) => {
    console.error(reason as any);
});

process.on("uncaughtException", async (err) => {
    console.error(err);
});
process.on("uncaughtExceptionMonitor", async (err) => {
    console.error(err);
});
process.on("UnhandledPromiseRejection", (err) => {
    console.error(err);
});