import {
    APIApplicationCommandAutocompleteDMInteraction,
    APIApplicationCommandAutocompleteGuildInteraction,
    APIChatInputApplicationCommandDMInteraction,
    APIChatInputApplicationCommandGuildInteraction, APIMessageComponentButtonInteraction, APIPingInteraction
} from "discord-api-types/v10";

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export enum ApplicationIntegrationType {
    GUILD_INSTALL = 0,
    USER_INSTALL = 1
}

export enum InteractionContextType {
    GUILD = 0,
    BOT_DM = 1,
    PRIVATE_CHANNEL = 2
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export interface ICommandOptionChoice {
    name: string,
    value: string
}

export interface ICommandOption {
    "name": string,
    "description": string,
    "type": ApplicationCommandOptionType,
    "required"?: boolean,
    autocomplete?: boolean
    "choices"?: ICommandOptionChoice[],
    "options"?: ICommandOption[],
}

export interface ICommand {
    name: string,
    type: ApplicationCommandType,
    options?: ICommandOption[],
    description: string,
    integration_types: ApplicationIntegrationType[],
    contexts: InteractionContextType[],
}

export type BodyType = APIChatInputApplicationCommandGuildInteraction
    | APIChatInputApplicationCommandDMInteraction
    | APIApplicationCommandAutocompleteDMInteraction
    | APIApplicationCommandAutocompleteGuildInteraction
    | APIMessageComponentButtonInteraction
    | APIPingInteraction;