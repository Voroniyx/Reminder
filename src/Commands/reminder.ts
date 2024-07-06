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
import {CreateId} from "../Handler/CreateId.js";

export class Reminder {
    public static GetCommandData(): ICommand {
        return {
            type: ApplicationCommandType.CHAT_INPUT,
            contexts: [InteractionContextType.BOT_DM, InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL],
            description: "Verwalte deine Reminder",
            name: "reminder",
            integration_types: [ApplicationIntegrationType.USER_INSTALL],
            options: [
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "create",
                    description: "Erstelle eine neuen Reminder",
                    options: [
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "zeit",
                            description: "In wie vielen Tagen/Stunden/Minuten soll ich dich erinnern?",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "name",
                            description: "Woran soll ich dich erinnern?",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.BOOLEAN,
                            name: "wiederholen",
                            description: "Soll ich dich nach der Zeit erneut erinnern?",
                            required: false,
                        },
                    ]
                },
                {
                    name: "remove",
                    description: "Entfernt eine Erinnerung.",
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "reminder",
                            description: "Die Erinnerung die Entfernt werden soll",
                            autocomplete: true,
                            required: true,
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "view",
                    description: "Sie eine Liste deiner Erinnerung",
                }
            ]
        }
    }

    public static async execute(data: APIChatInputApplicationCommandGuildInteraction
        | APIChatInputApplicationCommandDMInteraction): Promise<APIInteractionResponseCallbackData> {
        try {
            if (data.context === v10InteractionContextType.BotDM || data.context === v10InteractionContextType.PrivateChannel) {
                data = data as APIChatInputApplicationCommandDMInteraction;
                if (data.data.options.find(x => x.name === "view").name === "view") {
                    return Reminder.handleViewSubCommand(data.user.id);
                }
                if (data.data.options.find(x => x.name === "create").name === "create") {
                    return Reminder.handleCreateSubCommand(data.user.id, data.data.options);
                }
                if (data.data.options.find(x => x.name === "remove").name === "remove") {
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

        return {
            embeds: [
                {
                    description: [
                        "## Deine Erinnerungen",
                        ...reminders.map(x => `${ZeitHandler.ToZeitStr(x.zeit)} ${x.name.slice(0, 52)}`),
                    ].join("\n"),
                }
            ]
        };
    }

    private static async handleCreateSubCommand(userId: string, data: APIApplicationCommandInteractionDataOption[]): Promise<APIInteractionResponseCallbackData> {
        const options = (data.find(x => x.name === "create") as APIApplicationCommandInteractionDataSubcommandOption).options;

        const name = options.find(x => x.name === "name");
        const zeit = options.find(x => x.name === "zeit");
        const wiederholen = options.find(x => x.name === "wiederholen");

        const createdReminder = await ReminderModel.create({
            name: name.value,
            userId: userId,
            reminderId: CreateId.create(),
            created: Date.now(),
            zeit: ZeitHandler.ToZeit(zeit.value as string),
            repeat: wiederholen?.value === undefined ? false : wiederholen.value,
            lastExecuted: 0,
        })

        return {
            embeds: [
                {
                    description: [
                        "## Erinnerung erstellt:",
                        `Name: ${createdReminder.name}`,
                        `Zeit: ${ZeitHandler.ToZeitStr(createdReminder.zeit)}`,
                        `Erstellt: <t:${createdReminder.created / 1000 | 0}:F>`,
                        `Wiederholen: ${createdReminder.repeat ? "Ja" : "Nein"}`
                    ].join("\n"),
                }
            ]
        };
    }

    private static async handleRemoveSubCommand(userId: string, data: APIApplicationCommandInteractionDataOption[]): Promise<APIInteractionResponseCallbackData> {
        const options = (data.find(x => x.name === "remove") as APIApplicationCommandInteractionDataSubcommandOption).options;

        const reminder = options.find(x => x.name === "reminder");

        const deletedReminder = await ReminderModel.deleteOne({reminderId: reminder.value})

        if (deletedReminder.deletedCount > 0) {
            return {
                embeds: [
                    {
                        description: [
                            `Erinnerung wurde gelöscht!`,
                        ].join("\n"),
                    }
                ]
            };
        } else {
            return {
                embeds: [
                    {
                        description: [
                            "Erinnerung wurde nicht gelöscht!",
                        ].join("\n"),
                    }
                ]
            };
        }


    }
}