export var ApplicationCommandType;
(function (ApplicationCommandType) {
    ApplicationCommandType[ApplicationCommandType["CHAT_INPUT"] = 1] = "CHAT_INPUT";
    ApplicationCommandType[ApplicationCommandType["USER"] = 2] = "USER";
    ApplicationCommandType[ApplicationCommandType["MESSAGE"] = 3] = "MESSAGE";
})(ApplicationCommandType || (ApplicationCommandType = {}));
export var ApplicationIntegrationType;
(function (ApplicationIntegrationType) {
    ApplicationIntegrationType[ApplicationIntegrationType["GUILD_INSTALL"] = 0] = "GUILD_INSTALL";
    ApplicationIntegrationType[ApplicationIntegrationType["USER_INSTALL"] = 1] = "USER_INSTALL";
})(ApplicationIntegrationType || (ApplicationIntegrationType = {}));
export var InteractionContextType;
(function (InteractionContextType) {
    InteractionContextType[InteractionContextType["GUILD"] = 0] = "GUILD";
    InteractionContextType[InteractionContextType["BOT_DM"] = 1] = "BOT_DM";
    InteractionContextType[InteractionContextType["PRIVATE_CHANNEL"] = 2] = "PRIVATE_CHANNEL";
})(InteractionContextType || (InteractionContextType = {}));
export var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionType[ApplicationCommandOptionType["STRING"] = 3] = "STRING";
    ApplicationCommandOptionType[ApplicationCommandOptionType["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionType[ApplicationCommandOptionType["USER"] = 6] = "USER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionType[ApplicationCommandOptionType["ROLE"] = 8] = "ROLE";
    ApplicationCommandOptionType[ApplicationCommandOptionType["MENTIONABLE"] = 9] = "MENTIONABLE";
    ApplicationCommandOptionType[ApplicationCommandOptionType["NUMBER"] = 10] = "NUMBER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["ATTACHMENT"] = 11] = "ATTACHMENT";
})(ApplicationCommandOptionType || (ApplicationCommandOptionType = {}));
