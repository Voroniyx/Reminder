import { randomBytes } from 'crypto';

export class CreateId {
    public static create() {
        const length = 36;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueId = '';

        // Generate cryptographically secure random bytes
        const randomValues = randomBytes(length);

        for (let i = 0; i < length; i++) {
            uniqueId += characters.charAt(randomValues[i] % characters.length);
        }

        return uniqueId;
    }
}