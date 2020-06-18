declare class JSONEditor {
    public static defaults: {[k: string]: any};

    public constructor(element: HTMLElement, options: {[k: string]: any});
    public getValue(): any;
    public setValue(value: any): void;
    public validate(): {path: string, property: string, message: string}[]
    public on(event: string, callback: () => void): void;
    public getEditor(path: string): JSONEditor;
}