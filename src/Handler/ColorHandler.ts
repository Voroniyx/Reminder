export class ColorHandler {

    private static _colors = {
        "Red": 0xff0000,
        "Yellow": 0xffff00,
        "Green": 0x00ff33,
        "Blue": 0x0000ff,
    }

    public static get(color: keyof typeof this._colors) {
        return this._colors[color];
    }
}
