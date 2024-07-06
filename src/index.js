import * as dotenv from "dotenv";
dotenv.config();
import { REST } from '@discordjs/rest';
export const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const response = rest.post('/', {});
