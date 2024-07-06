import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from "../types/types.js";
import { InteractionContextType as v10InteractionContextType } from "discord-api-types/v10";
import { ReminderModel } from "../Database/reminder";
import { ZeitHandler } from "../Handler/ZeitHandler";
export class Reminder {
    static GetCommandData() {
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
        };
    }
    static async execute(data) {
        console.log("execute");
        try {
            if (data.context === v10InteractionContextType.BotDM || data.context === v10InteractionContextType.PrivateChannel) {
                data = data;
                if (data.data.options.find(x => x.name === "view").name === "view") {
                    return Reminder.handleViewSubCommand(data.user.id);
                }
            }
            if (data.context == v10InteractionContextType.Guild) {
                data = data;
                if (data.data.options.find(x => x.name === "view").name === "view") {
                    return Reminder.handleViewSubCommand(data.member.user.id);
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
    static async autoComplete(data) {
    }
    static async handleViewSubCommand(userId) {
        const reminders = await ReminderModel.find({ userId: userId });
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
    static async handleCreateSubCommand() {
    }
    static async handleRemoveSubCommand() {
    }
}
