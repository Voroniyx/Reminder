export class ZeitHandler {
    static ToZeit(str) {
        const zeit = {};
        const pattern = /(\d+)\s*(Minuten|m|Stunden|h|Tage|d)/gi;
        let match;
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
    static ToZeitStr(zeit) {
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
    static AddTimeToDate(timestamp, zeit) {
        // Erstelle ein neues Date-Objekt aus dem timestamp
        const date = new Date(timestamp);
        // Extrahiere die Stunden, Minuten und Tage aus dem zeit-Objekt, falls sie vorhanden sind
        const stunden = zeit.Stunden || 0;
        const minuten = zeit.Minuten || 0;
        const tage = zeit.Tage || 0;
        // Addiere die Tage
        date.setDate(date.getDate() + tage);
        // Addiere die Stunden
        date.setHours(date.getHours() + stunden);
        // Addiere die Minuten
        date.setMinutes(date.getMinutes() + minuten);
        return date;
    }
}
