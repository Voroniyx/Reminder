import mongoose, {Model} from 'mongoose'

export interface Settings extends Document {
    userId: string,
    lang: string,
}

// Define the schema
const SettingsSchema = new mongoose.Schema({
    userId: {type: String, default: ""},
    lang: {type: String, default: ""},
})

// Define the model
export const SettingsModel: Model<Settings> = mongoose.model<Settings>(
    'Settings',
    SettingsSchema,
)

export async function getSettingsOrCreateOne(userId: string) {
    const settings = await SettingsModel.findOne({userId: userId});
    if (!settings) {
        return await SettingsModel.create({
            userId: userId,
            lang: 'en',
        });
    }
    return settings;
}