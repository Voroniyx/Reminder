import mongoose, {Model} from 'mongoose'
import {Zeit} from "../Handler/ZeitHandler.js";

export interface Reminder extends Document {
    userId: string,
    reminderId: string,
    created: number,
    zeit: Zeit,
    repeat: boolean,
    name: string,
    lastExecuted: number
}

// Define the schema
const ReminderSchema = new mongoose.Schema({
    userId: {type: String, default: ""},
    reminderId: {type: String, default: ""},
    created: {type: Number, default: 0},
    name: {type: String, default: ""},
    repeat: {type: Boolean, default: false},
    lastExecuted: {type: Number, default: 0},
    zeit: {
        Stunden: {type: Number, default: 0},
        Minuten: {type: Number, default: 0},
        Tage: {type: Number, default: 0}
    }
})

// Define the model
export const ReminderModel: Model<Reminder> = mongoose.model<Reminder>(
    'Reminder',
    ReminderSchema,
)

