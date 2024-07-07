import * as globPkg from 'glob';
import * as fs from 'fs';

const {glob} = globPkg;
const {promises: fsp} = fs;

export interface ICaption {
    key: string,
    value: string,
}

export class LangHandler {

    private _captions = new Map<string, ICaption[]>();

    constructor() {
        this.loadCaptions().then(() => console.log("Captions loaded"));
    }


    private async loadCaptions() {
        const files = await this.getJSONFilesInDir("/captions/");
        files.forEach(async file => {
            const lang = this.getFileName(file).withoutExtension;
            const content = await this.loadJSONFileContent<ICaption[]>(file);

            this._captions.set(lang, content);
        })
    }

    private async getJSONFilesInDir(dirName: `/${string}/`) {
        return await glob(`${process.cwd().replace(/\\/g, "/")}${dirName}*.json`);
    }

    private getFileName(path: string) {
        // Extrahiere den Dateinamen mit Extension
        const fileNameWithExtension = path.split(/[/\\]/).pop() || '';

        // Extrahiere den Dateinamen ohne Extension
        const fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.') || fileNameWithExtension;

        return {
            withExtension: fileNameWithExtension,
            withoutExtension: fileNameWithoutExtension
        };
    }


    private async loadJSONFileContent<T>(path: string): Promise<T> {
        try {
            // Dateiinhalt lesen
            const data = await fsp.readFile(path, 'utf-8');
            // JSON parsen und zurückgeben
            return JSON.parse(data) as T;
        } catch (error) {
            // Fehlerbehandlung
            throw new Error(`Error reading or parsing JSON file: ${error.message}`);
        }
    }

    public get(key: string, lang: string): string {
        return this._captions.get(lang).find(x => x.key === key).value ?? "";
    }
}