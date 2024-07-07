import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ApplicationIntegrationType,
    ICommand,
    InteractionContextType
} from "../types/types.js";
import {
    APIApplicationCommandAutocompleteDMInteraction,
    APIApplicationCommandAutocompleteGuildInteraction,
    APIApplicationCommandAutocompleteResponse,
    APIApplicationCommandInteractionDataOption, APIApplicationCommandOptionChoice,
    APIChatInputApplicationCommandDMInteraction,
    APIChatInputApplicationCommandGuildInteraction,
    APIInteractionResponseCallbackData,
    InteractionContextType as v10InteractionContextType,
    InteractionResponseType
} from "discord-api-types/v10";
import {ReminderModel} from "../Database/reminder.js";
import {ZeitHandler} from "../Handler/ZeitHandler.js";
import type {
    APIApplicationCommandInteractionDataSubcommandOption
} from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommand";
import {Response} from "express";
import {IdHandler} from "../Handler/IdHandler.js";
import {ColorHandler} from "../Handler/ColorHandler.js";
import {getSettingsOrCreateOne} from "../Database/settings.js";
import {lang} from "../index.js";

export class Reminder {
    public static GetCommandData(): ICommand {
        return {
            type: ApplicationCommandType.CHAT_INPUT,
            contexts: [InteractionContextType.BOT_DM, InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL],
            description: "Manage your reminders",
            name: "reminder",
            integration_types: [ApplicationIntegrationType.USER_INSTALL],
            options: [
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "create",
                    description: "Create a new reminder",
                    options: [
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "time",
                            description: "In how many days/hours/minutes should I remind you?",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "name",
                            description: "What do you want me to remind you of?",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.BOOLEAN,
                            name: "repeat",
                            description: "Shall I remind you again after the time?",
                            required: false,
                        },
                    ]
                },
                {
                    name: "remove",
                    description: "Removes a reminder.",
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "reminder",
                            description: "The reminder to be removed",
                            autocomplete: true,
                            required: true,
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "view",
                    description: "Shows your reminders",
                }
            ]
        }
    }

    public static async execute(data: APIChatInputApplicationCommandGuildInteraction
        | APIChatInputApplicationCommandDMInteraction): Promise<APIInteractionResponseCallbackData> {
        try {
            if (data.context === v10InteractionContextType.BotDM || data.context === v10InteractionContextType.PrivateChannel) {
                data = data as APIChatInputApplicationCommandDMInteraction;
                if (data.data.options.find(x => x.name === "view")) {
                    return Reminder.handleViewSubCommand(data.user.id);
                }
                if (data.data.options.find(x => x.name === "create")) {
                    return Reminder.handleCreateSubCommand(data.user.id, data.data.options);
                }
                if (data.data.options.find(x => x.name === "remove")) {
                    return Reminder.handleRemoveSubCommand(data.user.id, data.data.options);
                }
            }

            if (data.context == v10InteractionContextType.Guild) {
                data = data as APIChatInputApplicationCommandGuildInteraction;
                if (data.data.options.find(x => x.name === "view")) {
                    return Reminder.handleViewSubCommand(data.member.user.id);
                }
                if (data.data.options.find(x => x.name === "create")) {
                    return Reminder.handleCreateSubCommand(data.member.user.id, data.data.options);
                }
                if (data.data.options.find(x => x.name === "remove")) {
                    return Reminder.handleRemoveSubCommand(data.member.user.id, data.data.options);
                }
            }
        } catch (e) {
            throw e;
        }
    }

    public static async autoComplete(data: APIApplicationCommandAutocompleteDMInteraction
        | APIApplicationCommandAutocompleteGuildInteraction, res: Response) {

        let userId = "";

        switch (data.context) {
            case v10InteractionContextType.PrivateChannel:
            case v10InteractionContextType.BotDM: {
                data = data as APIApplicationCommandAutocompleteDMInteraction;
                userId = data.user.id;
                break;
            }
            case v10InteractionContextType.Guild: {
                data = data as APIApplicationCommandAutocompleteGuildInteraction;
                userId = data.member.user.id;
                break;
            }
        }

        if (userId === "") {
            return;
        } else {
            const reminders = await ReminderModel.find({userId: userId});

            const choices: APIApplicationCommandOptionChoice<string | number>[] = [
                ...reminders.map(x => {
                    return {
                        value: x.reminderId,
                        name: x.name
                    }
                }),
            ]

            const response: APIApplicationCommandAutocompleteResponse = {
                type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                data: {
                    choices: choices
                }
            }

            res.json(response)
        }
    }

    private static async handleViewSubCommand(userId: string): Promise<APIInteractionResponseCallbackData> {
        const reminders = await ReminderModel.find({userId: userId});
        const settings = await getSettingsOrCreateOne(userId);

        return {
            embeds: [
                {
                    color: ColorHandler.get("Yellow"),
                    description: [
                        lang.get("reminder.command.view.title",settings.lang),
                        reminders.length === 0 ?
                            lang.get("reminder.command.view.no_reminder",settings.lang)
                            : reminders.map((x, i) => `\`${i + 1}\` ${ZeitHandler.ToZeitStr(x.zeit)} [<t:${ZeitHandler.AddTimeToDate(x.created, x.zeit).getTime() / 1000 | 0}:F>] ${x.name.slice(0, 28)}`).join("\n"),
                    ].join("\n"),
                }
            ]
        };
    }

    private static async handleCreateSubCommand(userId: string, data: APIApplicationCommandInteractionDataOption[]): Promise<APIInteractionResponseCallbackData> {
        const settings = await getSettingsOrCreateOne(userId);

        const options = (data.find(x => x.name === "create") as APIApplicationCommandInteractionDataSubcommandOption).options;

        const name = options.find(x => x.name === "name");
        const zeit = options.find(x => x.name === "time");
        const wiederholen = options.find(x => x.name === "repeat");

        const createdReminder = await ReminderModel.create({
            name: name.value,
            userId: userId,
            reminderId: IdHandler.create(),
            created: Date.now(),
            zeit: ZeitHandler.ToZeit(zeit.value as string),
            repeat: wiederholen?.value === undefined ? false : wiederholen.value,
            lastExecuted: 0,
        })

        return {
            embeds: [
                {
                    color: ColorHandler.get("Yellow"),
                    description: [
                        lang.get("reminder.command.create.title",settings.lang),
                        `${lang.get("reminder.command.create.name",settings.lang)} ${createdReminder.name}`,
                        `${lang.get("reminder.command.create.time",settings.lang)} ${ZeitHandler.ToZeitStr(createdReminder.zeit)}`,
                        `${lang.get("reminder.command.create.created",settings.lang)} <t:${createdReminder.created / 1000 | 0}:F>`,
                        `${lang.get("reminder.command.create.repeat",settings.lang)} ${createdReminder.repeat ?
                            lang.get("yes",settings.lang)
                            : lang.get("no",settings.lang)}`
                    ].join("\n"),
                }
            ]
        };
    }

    private static async handleRemoveSubCommand(userId: string, data: APIApplicationCommandInteractionDataOption[]): Promise<APIInteractionResponseCallbackData> {
        const settings = await getSettingsOrCreateOne(userId);

        const options = (data.find(x => x.name === "remove") as APIApplicationCommandInteractionDataSubcommandOption).options;

        const reminder = options.find(x => x.name === "reminder");

        const deletedReminder = await ReminderModel.deleteOne({reminderId: reminder.value})

        if (deletedReminder.deletedCount > 0) {
            return {
                embeds: [
                    {
                        description:lang.get("reminder.button.delete.success",settings.lang),
                        color: ColorHandler.get("Green")
                    }
                ]
            };
        } else {

            return {
                embeds: [
                    {
                        description:lang.get("reminder.button.delete.fail",settings.lang),
                        color: ColorHandler.get("Red")
                    }
                ]
            };
        }
    }
}