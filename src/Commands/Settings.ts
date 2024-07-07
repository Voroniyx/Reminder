import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ApplicationIntegrationType,
    ICommand,
    InteractionContextType
} from "../types/types.js";
import {
    APIApplicationCommandInteractionDataOption,
    APIChatInputApplicationCommandDMInteraction,
    APIChatInputApplicationCommandGuildInteraction,
    APIInteractionResponseCallbackData,
    InteractionContextType as v10InteractionContextType
} from "discord-api-types/v10";
import type {
    APIApplicationCommandInteractionDataSubcommandOption
} from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommand";
import {ColorHandler} from "../Handler/ColorHandler.js";
import {getSettingsOrCreateOne, SettingsModel} from "../Database/settings.js";
import {lang} from "../index.js";

export class Settings {
    public static GetCommandData(): ICommand {
        return {
            type: ApplicationCommandType.CHAT_INPUT,
            contexts: [InteractionContextType.BOT_DM, InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL],
            description: "Manage your settings",
            name: "settings",
            integration_types: [ApplicationIntegrationType.USER_INSTALL],
            options: [
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "set-lang",
                    description: "Manage your language",
                    options: [
                        {
                            type: ApplicationCommandOptionType.STRING,
                            name: "lang",
                            description: "Which language do you want to use?",
                            choices: [
                                {
                                    name: 'German',
                                    value: 'de'
                                },
                                {
                                    name: 'English',
                                    value: 'en'
                                },
                            ],
                            required: true,
                        },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.SUB_COMMAND,
                    name: "view",
                    description: "See your settings",
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
                    return Settings.handleViewSubCommand(data.user.id);
                }
                if (data.data.options.find(x => x.name === "set-lang")) {
                    return Settings.handleSetLangSubCommand(data.user.id, data.data.options);
                }
            }

            if (data.context == v10InteractionContextType.Guild) {
                data = data as APIChatInputApplicationCommandGuildInteraction;
                if (data.data.options.find(x => x.name === "view")) {
                    return Settings.handleViewSubCommand(data.member.user.id);
                }
                if (data.data.options.find(x => x.name === "set-lang")) {
                    return Settings.handleSetLangSubCommand(data.member.user.id, data.data.options);
                }
            }
        } catch (e) {
            throw e;
        }
    }

    private static async handleViewSubCommand(userId: string): Promise<APIInteractionResponseCallbackData> {
        const settings = await getSettingsOrCreateOne(userId);

        return {
            embeds: [
                {
                    color: ColorHandler.get("Yellow"),
                    description: [
                        lang.get("settings.command.view.title", settings.lang),
                        `${lang.get("settings.command.view.lang", settings.lang)} \`${settings.lang}\``
                    ].join("\n"),
                }
            ]
        };
    }

    private static async handleSetLangSubCommand(userId: string, data: APIApplicationCommandInteractionDataOption[]): Promise<APIInteractionResponseCallbackData> {
        const options = (data.find(x => x.name === "set-lang") as APIApplicationCommandInteractionDataSubcommandOption).options;

        const selectedLanguage = options.find(x => x.name === "lang").value as string;

        const settings = await getSettingsOrCreateOne(userId);

       await SettingsModel.findOneAndUpdate({userId: settings.userId}, {$set: {lang: selectedLanguage}});

        return {
            embeds: [
                {
                    color: ColorHandler.get("Yellow"),
                    description: [
                        lang.get("settings.command.view.title", selectedLanguage),
                        `${lang.get("settings.command.view.lang", selectedLanguage)} \`${selectedLanguage}\``
                    ].join("\n"),
                }
            ]
        };
    }
}