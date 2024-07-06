import mongoose from 'mongoose';
// Define the schema
const ReminderSchema = new mongoose.Schema({
    userId: { type: String, default: "" },
    reminderId: { type: String, default: "" },
    name: { type: String, default: "" },
    repeat: { type: Boolean, default: false },
    zeit: {
        Stunden: { type: Number, default: 0 },
        Minuten: { type: Number, default: 0 },
        Tage: { type: Number, default: 0 }
    }
});
// Define the model
export const ReminderModel = mongoose.model('Reminder', ReminderSchema);
