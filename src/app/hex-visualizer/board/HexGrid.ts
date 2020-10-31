import { GamePieceColor } from './GamePieceColor';
import { Hexagon } from './/Hexagon';
import { GamePiece } from './pieces/GamePiece';
import { Point } from "./Point";
import { BlackPiece } from './pieces/BlackPiece';
import { WhitePiece } from './pieces/WhitePiece';
import { CanvasSingleton } from './CanvasSingleton';
import { HexagonSide } from './HexagonSide';
import { GameSettingsSingleton } from '../GameSettingsSingleton';
import { BoardSpace } from './BoardSpace';
import { MoveManager } from '../moves/MoveManager';
import { MoveCommand } from '../moves/MoveCommand';
import { Move } from '../moves/Move';

export class HexGrid {
    canvasSingleton: CanvasSingleton
    gameSettingsSingleton: GameSettingsSingleton
    // hexagons: Array<Array<Hexagon>>
    // boardSpaces: Array<Array<GamePiece>>;

    public constructor() {
        this.canvasSingleton = CanvasSingleton.getInstance()
        this.gameSettingsSingleton = GameSettingsSingleton.getInstance()
        this.createBoard()
    }

    public createBoard() {
        this.gameSettingsSingleton.resetBoardMatrix()

        let windowWidthMiddle = Math.round(this.canvasSingleton.getCanvas().width / 2)
        let windowHeightMiddle = Math.round(this.canvasSingleton.getCanvas().height / 2)

        let startx = windowWidthMiddle - ((this.gameSettingsSingleton.cols * Hexagon.getWidth(this.gameSettingsSingleton.getHexagonRadius())) / 2);
        let starty = windowHeightMiddle - ((this.gameSettingsSingleton.rows * Hexagon.getHeight(this.gameSettingsSingleton.getHexagonRadius())) / 2);

        let originX = startx;
        let originY = starty;

        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            let boardSpaceRow: Array<BoardSpace> = []
            for (let j = 0; j < this.gameSettingsSingleton.cols; j++) {
                let hexagon: Hexagon = new Hexagon(new Point(originX, originY), this.gameSettingsSingleton.getHexagonRadius());
                // add a board space for every hexagon
                boardSpaceRow.push(new BoardSpace(hexagon, null))
                originX = originX + Hexagon.getWidth(this.gameSettingsSingleton.getHexagonRadius());
            }
            // push BoardSpace (contains Hexagon and GamePiece) row to 2D matrix
            this.gameSettingsSingleton.addRowToBoardMatrix(boardSpaceRow);
            // set x and y starting point for next hexagon row
            originX = startx + (0.5 * Hexagon.getWidth(this.gameSettingsSingleton.getHexagonRadius())) + (0.5 * i * Hexagon.getWidth(this.gameSettingsSingleton.getHexagonRadius()));
            originY = originY + Hexagon.getHeight(this.gameSettingsSingleton.getHexagonRadius());
        }
    }



    public renderGrid(): void {
        // render hexagons
        this.gameSettingsSingleton.getHexagonsInBoard().forEach((hexagon: Hexagon) => {
            hexagon.render();
        })
        // render black or whit game pieces if they exist
        this.gameSettingsSingleton.getGamePiecesInBoard().forEach((gamePiece: GamePiece) => {
            if (gamePiece != null) {
                gamePiece.render();
            }
        });
        this.renderBorder();
    }

    public checkMouseClick(x: number, y: number): void {
        // check if mouseclick happened inside any hexagons
        let boardSpaces: Array<Array<BoardSpace>>= this.gameSettingsSingleton.getBoardSpacesAsMatrix();
        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            for (let j = 0; j < this.gameSettingsSingleton.cols; j++) {
                let space: BoardSpace = this.gameSettingsSingleton.getSpecificBoardSpace(i, j)
                if (space.hexagon.containsPoint(new Point(x, y))) {
                    // prevent space from being clicked on more than once
                    // check if there is already a black or white game piece occupying that space
                    if (space.gamePiece == null) {
                        if (this.gameSettingsSingleton.currentTurn == GamePieceColor.Black) {
                            // set a black stone to the space that was clicked, and then set that it is black's turn to now make a move
                            space.gamePiece = new BlackPiece(space.hexagon.origin, this.gameSettingsSingleton.getGamePieceRadius());
                            this.gameSettingsSingleton.currentTurn = GamePieceColor.White;
                            // let Move Manager know that we made a valid move
                            MoveManager.getInstance().invokeCommand(new MoveCommand(new Move(i, j, GamePieceColor.Black)))
                        } else if (this.gameSettingsSingleton.currentTurn == GamePieceColor.White) {
                            // set a white stone to the space that was clicked, and then set that it is black's turn to now make a move
                            space.gamePiece = new WhitePiece(space.hexagon.origin, this.gameSettingsSingleton.getGamePieceRadius());
                            this.gameSettingsSingleton.currentTurn = GamePieceColor.Black;
                            // let Move Manager know that we made a valid move
                            MoveManager.getInstance().invokeCommand(new MoveCommand(new Move(i, j, GamePieceColor.White)))
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
        this.renderTopBorder()
        this.renderBottomBorder()
        this.renderLeftBorder()
        this.renderRightBorder()
    }

    private renderTopBorder(): void {
        // get canvas context to draw
        let ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.y
        );
        for(let i = 0; i < this.gameSettingsSingleton.cols; i++) {
            // loop through top row cells
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.y
            );
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = GamePieceColor.White;
            ctx.stroke();
        }
    }

    private renderBottomBorder(): void {
        // get canvas context to draw
        let ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.y
        );
        for(let i = 0; i < this.gameSettingsSingleton.cols; i++) {
            // loop through top row cells
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, i).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, i).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.y
            );
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, i).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows-1, i).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = GamePieceColor.White;
            ctx.stroke();
        }
    }

    private renderLeftBorder(): void {
        // get canvas context to draw
        let ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.y
        );
        for(let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            // loop through top row cells
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.y
            );
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = GamePieceColor.Black;
            ctx.stroke();
        }
    }

    private renderRightBorder(): void {
        // get canvas context to draw
        let ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.y
        );
        for(let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            // loop through top row cells
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.y
            );
            //-----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols-1).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = GamePieceColor.Black;
            ctx.stroke();
        }
    }
}