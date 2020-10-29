

export class CanvasSingleton {
    private static singleton: CanvasSingleton = null;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private constructor() {}

    public static getInstance() {
        if (this.singleton == null) {
            this.singleton = new CanvasSingleton();
        }
        return this.singleton
    }

    public setContext(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }
}