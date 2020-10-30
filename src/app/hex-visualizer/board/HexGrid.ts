import { GamePieceColor } from './GamePieceColor';
import { Hexagon } from './/Hexagon';
import { GamePiece } from './pieces/GamePiece';
import { Point } from "./Point";
import { BlackPiece } from './pieces/BlackPiece';
import { WhitePiece } from './pieces/WhitePiece';
import { CanvasSingleton } from './CanvasSingleton';
import { HexagonColorInstruction, HexagonSideDetails, HexagonSides } from './HexagonColorInstruction';

export class HexGrid {
    rows: number;
    cols: number;
    radius: number;
    hexagons: Array<Array<Hexagon>>
    boardSpaces: Array<Array<GamePiece>>;
    currentTurn: GamePieceColor = GamePieceColor.Black;

    public constructor(rows, cols, radius) {
        this.rows = rows;
        this.cols = cols;
        this.radius = radius;
        this.hexagons = [];
        this.boardSpaces = []

        let windowWidthMiddle = Math.round(CanvasSingleton.getInstance().getCanvas().width / 2)
        let windowHeightMiddle = Math.round(CanvasSingleton.getInstance().getCanvas().height / 2)

        let startx = windowWidthMiddle - ((cols * Hexagon.getWidth(radius)) / 2);
        let starty = windowHeightMiddle - ((rows * Hexagon.getHeight(radius)) / 2);

        let originX = startx;
        let originY = starty;

        for (let i = 0; i < rows; i++) {
            let hexagonRow: Array<Hexagon> = []
            let boardSpacesRow: Array<GamePiece> = []
            for (let j = 0; j < cols; j++) {
                // let colorInstruction: HexagonColorInstruction = this.determineHexagonBorders(i, j);
                let h: Hexagon = new Hexagon(new Point(originX, originY), radius, new HexagonColorInstruction(new Map()));
                hexagonRow.push(h);
                // add a board space for every hexagon
                boardSpacesRow.push(null);
                originX = originX + Hexagon.getWidth(radius);
            }
            // push hexagon row to 2D matrix
            this.hexagons.push(hexagonRow);
            // push game piece to 2D matrix
            this.boardSpaces.push(boardSpacesRow)
            // set x and y starting point for next hexagon row
            originX = startx + (0.5 * Hexagon.getWidth(radius)) + (0.5 * i * Hexagon.getWidth(radius));
            originY = originY + Hexagon.getHeight(radius);
        }
    }

    public renderGrid(): void {
        // render hexagons
        this.hexagons.forEach((hexRow: Hexagon[]) => {
            hexRow.forEach((hexagon) => {
                hexagon.render();
            })
        })
        // render black or whit game pieces if they exist
        this.boardSpaces.forEach((gamePieceRow: GamePiece[]) => {
            gamePieceRow.forEach((gamePiece) => {
                if (gamePiece != null) {
                    gamePiece.render();
                }
            }) 
        });
        this.renderBorder();
    }

    public checkMouseClick(x: number, y: number): void {
        // check if mouseclick happened inside any hexagons
        for (let i = 0; i < this.hexagons.length; i++) {
            for (let j = 0; j < this.hexagons[i].length; j++) {
                let h: Hexagon = this.hexagons[i][j];
                if (h.containsPoint(new Point(x, y))) {
                    console.log(`i = ${i}, j = ${j} `)
                    // prevent space from being clicked on more than once
                    if (this.boardSpaces[i][j] == null) {
                        if (this.currentTurn == GamePieceColor.Black) {
                            this.boardSpaces[i][j] = new BlackPiece(h.origin, this.radius / 2);
                            this.currentTurn = GamePieceColor.White;
                        } else if (this.currentTurn == GamePieceColor.White) {
                            this.boardSpaces[i][j] = new WhitePiece(h.origin, this.radius / 2);
                            this.currentTurn = GamePieceColor.Black;
                        }
                    }
                }
            }
        }
    }

    public checkWinState(): boolean {
        // write for determining if a player won the game 
        throw new Error("not Implemented yet, File: HexGrid.ts (Function: checkWinState()")
    }

    renderBorder() {
        let ctx = CanvasSingleton.getInstance().getContext();

        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(this.hexagons[0][0].vertices[3].x, this.hexagons[0][0].vertices[3].y);
        for(let i = 0; i < this.cols; i++) {
            for(let j = 4; j <= 5; j++) { 
                ctx.lineTo(this.hexagons[0][i].vertices[j].x, this.hexagons[0][i].vertices[j].y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = GamePieceColor.White;
                ctx.stroke();         
            }
        }

        // render bottom border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(this.hexagons[this.rows-1][0].vertices[2].x, this.hexagons[this.rows-1][0].vertices[2].y);
        for(let i = 0; i < this.cols; i++) {
            for(let j = 1; j >= 0; j--) { 
                ctx.lineTo(this.hexagons[this.rows-1][i].vertices[j].x, this.hexagons[this.rows-1][i].vertices[j].y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = GamePieceColor.White;
                ctx.stroke();         
            }
        }

        // render left border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(this.hexagons[0][0].vertices[3].x, this.hexagons[0][0].vertices[3].y);
        for(let i = 0; i < this.rows; i++) {
            for(let j = 2; j >= 1; j--) {
                ctx.lineTo(this.hexagons[i][0].vertices[j].x, this.hexagons[i][0].vertices[j].y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = GamePieceColor.Black;
                ctx.stroke();         
            }
        }

        // render right border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(this.hexagons[this.rows-1][this.cols-1].vertices[0].x, this.hexagons[this.rows-1][this.cols-1].vertices[0].y);
        for(let i = this.rows-1; i >= 0; i--) {
            for(let j = 5; j >= 4; j--) {
                ctx.lineTo(this.hexagons[i][this.cols-1].vertices[j].x, this.hexagons[i][this.cols-1].vertices[j].y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = GamePieceColor.Black;
                ctx.stroke();         
            }
        }
    }

    private determineHexagonBorders(rowIndex: number, colIndex: number): HexagonColorInstruction {
        let borderSize = 5;
        // determine what to color the borders of the hexagon
        if (rowIndex === 0 && colIndex === 0) {
            // top-left corner
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.TopRight, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.TopLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.Left, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            return new HexagonColorInstruction(map)
        } else if (rowIndex === 0 && colIndex === this.cols - 1) {
            // top-right corner
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.TopLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.Right, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.BottomRight, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            return new HexagonColorInstruction(map)
        } else if (rowIndex === this.rows - 1 && colIndex === 0) {
            // bottom-left corner
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.TopLeft, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.BottomRight, new HexagonSideDetails(GamePieceColor.White, borderSize))
            return new HexagonColorInstruction(map)
        } else if (rowIndex === this.rows - 1 && colIndex === this.cols - 1) {
            // bottom-right corner
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.BottomRight, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.Right, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.TopRight, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            return new HexagonColorInstruction(map)
        } else if (rowIndex === 0) {
            // top row
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.TopLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.TopRight, new HexagonSideDetails(GamePieceColor.White, borderSize))
            return new HexagonColorInstruction(map)
        } else if (rowIndex === this.rows - 1) {
            // bottom row
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.White, borderSize))
            map.set(HexagonSides.BottomRight, new HexagonSideDetails(GamePieceColor.White, borderSize))
            return new HexagonColorInstruction(map)
        } else if (colIndex === 0) {
            // left-side
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.Left, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            return new HexagonColorInstruction(map)
        } else if (colIndex === this.cols - 1) {
            // right-side
            let map = new Map<HexagonSides, HexagonSideDetails>()
            map.set(HexagonSides.Right, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            map.set(HexagonSides.TopRight, new HexagonSideDetails(GamePieceColor.Black, borderSize))
            return new HexagonColorInstruction(map)
        } else {
            // anywhere in the board space that is not the sides

        }
    }
}