import { GamePieceColor } from './GamePieceColor';
import { Hexagon } from './/Hexagon';
import { GamePiece } from './pieces/GamePiece';
import { Point } from "./Point";
import { BlackPiece } from './pieces/BlackPiece';
import { WhitePiece } from './pieces/WhitePiece';
import { CanvasSingleton } from './CanvasSingleton';

export class HexGrid {
    rows;
    cols;
    radius;
    hexagons: Hexagon[]
    boardSpaces: GamePiece[];
    currentTurn: GamePieceColor = GamePieceColor.Black;

    public constructor(rows, cols, radius) {
        this.rows = rows;
        this.cols = cols;
        this.radius = radius;
        this.hexagons = [];
        this.boardSpaces = []

        let windowWidthMiddle = Math.round(CanvasSingleton.getInstance().getCanvas().width / 2)
        let windowHeightMiddle = Math.round(CanvasSingleton.getInstance().getCanvas().height / 2)

        // double originX = windowWidthMiddle - ((cols * Hexagon.getWidth(radius)) / 2);
        // double originY = windowHeightMiddle + ((rows * Hexagon.getHeight(radius)) / 2);
        // canvas is 80% of the viewport (entire window)
        let startx = windowWidthMiddle - ((cols * Hexagon.getWidth(radius)) / 2);
        let starty = windowHeightMiddle - ((rows * Hexagon.getHeight(radius)) / 2);

        let originX = startx;
        let originY = starty;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let h: Hexagon = new Hexagon(new Point(originX, originY), radius);
                this.hexagons.push(h);
                // add a board space for every hexagon
                this.boardSpaces.push(null);
                originX = originX + Hexagon.getWidth(radius);
            }
            originX = startx + (0.5 * Hexagon.getWidth(radius)) + (0.5 * i * Hexagon.getWidth(radius));
            originY = originY + Hexagon.getHeight(radius);
        }
    }

    public renderGrid(): void {
        this.hexagons.forEach((h: Hexagon) => {
            h.render();
        })
        this.boardSpaces.forEach((gp: GamePiece) => {
            if (gp != null) {
                gp.render();
            }
        });
    }

    public checkMouseClick(x: number, y: number): void {
        // check if mouseclick happened inside any hexagons
        for (let i = 0; i < this.hexagons.length; i++) {
            let h: Hexagon = this.hexagons[i];
            if (h.containsPoint(new Point(x, y))) {
                // prevent space from being clicked on more than once
                if (this.boardSpaces[i] == null) {
                    if (this.currentTurn == GamePieceColor.Black) {
                        this.boardSpaces[i] = new BlackPiece(h.origin, this.radius / 2);
                        this.currentTurn = GamePieceColor.White;
                    } else if (this.currentTurn == GamePieceColor.White) {
                        this.boardSpaces[i] = new WhitePiece(h.origin, this.radius / 2);
                        this.currentTurn = GamePieceColor.Black;
                    }
                } else {

                }
            }
        }
    }
}