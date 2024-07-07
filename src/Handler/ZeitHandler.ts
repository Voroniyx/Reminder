export interface Zeit {
    Stunden?: number,
    Minuten?: number,
    Tage?: number
}

export class ZeitHandler {
    public static ToZeit(str: string): Zeit {
        const zeit: Zeit = {};

        const pattern = /(\d+)\s*(Minuten|m|Stunden|h|Tage|d)/gi;

        let match: RegExpExecArray | null;
        while ((match = pattern.exec(str)) !== null) {
            const value = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();

            switch (unit) {
                case "stunden":
                case "h":
                    zeit.Stunden = value;
                    break;
                case "minuten":
                case "m":
                    zeit.Minuten = value;
                    break;
                case "tage":
                case "d":
                    zeit.Tage = value;
            }
        }

        return zeit;
    }

    public static ToZeitStr(zeit: Zeit): string {
        let result = "";

        if (zeit.Tage !== undefined && zeit.Tage > 0) {
            result += `${zeit.Tage}d `;
        }

        if (zeit.Stunden !== undefined && zeit.Stunden > 0) {
            result += `${zeit.Stunden}h `;
        }

        if (zeit.Minuten !== undefined && zeit.Minuten > 0) {
            result += `${zeit.Minuten}m `;
        }

        return result;
    }

    public static AddTimeToDate(timestamp: number, zeit: Zeit) {
        const date = new Date(timestamp);

        const stunden = zeit.Stunden || 0;
        const minuten = zeit.Minuten || 0;
        const tage = zeit.Tage || 0;

        date.setDate(date.getDate() + tage);

        date.setHours(date.getHours() + stunden);

        date.setMinutes(date.getMinutes() + minuten);

        return date;
    }
}