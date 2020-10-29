import { CanvasSingleton } from '../CanvasSingleton';
import { GamePieceColor } from '../GamePieceColor';
import { Point } from '../Point';
import { GamePiece } from './GamePiece';


export class BlackPiece extends GamePiece {
    radius: number;

    public constructor(origin: Point, radius: number) {
        super(origin);
        this.radius = radius;
    }

    public getColor(): GamePieceColor {
        return GamePieceColor.Black;
    }

    public render(): void {
        let ctx = CanvasSingleton.getInstance().getContext();
        ctx.beginPath();
        ctx.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor();
        ctx.fill();
    }

}