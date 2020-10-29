import { GamePieceColor } from '../GamePieceColor';
import { Point } from '../Point';

export abstract class GamePiece {
    public origin: Point;

    public constructor(origin: Point) {
        this.origin = origin; 
    }

    public getOrigin(): Point {
        return this.origin;
    }

    public abstract getColor(): GamePieceColor;
    public abstract render(): void;



}