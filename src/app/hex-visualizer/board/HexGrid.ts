import {GamePieceColor} from './GamePieceColor';
import {Hexagon} from './/Hexagon';
import {GamePiece} from './pieces/GamePiece';
import {Point} from './Point';
import {CanvasSingleton} from './CanvasSingleton';
import {HexagonSide} from './HexagonSide';
import {GameSettingsSingleton} from '../GameSettingsSingleton';
import {BoardSpace} from './BoardSpace';
import {MoveManager} from '../moves/MoveManager';
import {MoveCommand} from '../moves/MoveCommand';
import {Move} from '../moves/Move';
import {BFSSolver} from '../solver/BFSSolver';
import { GameResult } from '../solver/GameResult';

import {NzMessageService} from 'ng-zorro-antd';


export class HexGrid {
    canvasSingleton: CanvasSingleton;
    gameSettingsSingleton: GameSettingsSingleton;
    
    public constructor(private messageSvc: NzMessageService) {
        this.canvasSingleton = CanvasSingleton.getInstance();
        this.gameSettingsSingleton = GameSettingsSingleton.getInstance();
        this.createBoard();
    }
    
    public createBoard() {
        this.gameSettingsSingleton.resetBoardMatrix();

        const windowWidthMiddle = Math.round(this.canvasSingleton.getCanvas().width / 2);
        const windowHeightMiddle = Math.round(this.canvasSingleton.getCanvas().height / 2);

        const startx = windowWidthMiddle - ((this.gameSettingsSingleton.cols * Hexagon.getWidth(this.gameSettingsSingleton.getHexagonRadius())) / 2);
        const starty = windowHeightMiddle - ((this.gameSettingsSingleton.rows * Hexagon.getHeight(this.gameSettingsSingleton.getHexagonRadius())) / 2);

        let originX = startx;
        let originY = starty;

        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            const boardSpaceRow: Array<BoardSpace> = [];
            for (let j = 0; j < this.gameSettingsSingleton.cols; j++) {
                const hexagon: Hexagon = new Hexagon(new Point(originX, originY), this.gameSettingsSingleton.getHexagonRadius());
                // add a board space for every hexagon
                boardSpaceRow.push(new BoardSpace(hexagon, null));
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
        });
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
        const boardSpaces: Array<Array<BoardSpace>> = this.gameSettingsSingleton.getBoardSpacesAsMatrix();
        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            for (let j = 0; j < this.gameSettingsSingleton.cols; j++) {
                const space: BoardSpace = this.gameSettingsSingleton.getSpecificBoardSpace(i, j);
                if (space.hexagon.containsPoint(new Point(x, y))) {
                    // prevent space from being clicked on more than once
                    // check if there is already a black or white game piece occupying that space
                    if (space.gamePiece == null) {
                        if (this.gameSettingsSingleton.currentTurn == GamePieceColor.Black) {
                            // let Move Manager know that we made a valid move
                            MoveManager.getInstance().invokeCommand(new MoveCommand(new Move(i, j, GamePieceColor.Black)));
                            // set that it is white's turn to now make a move
                            this.gameSettingsSingleton.currentTurn = GamePieceColor.White;
                            this.messageSvc.info(this.gameSettingsSingleton.currentTurn + " must now make a move");
                        } else if (this.gameSettingsSingleton.currentTurn == GamePieceColor.White) {
                            // let Move Manager know that we made a valid move
                            MoveManager.getInstance().invokeCommand(new MoveCommand(new Move(i, j, GamePieceColor.White)));
                            // set that it is white's turn to now make a move
                            this.gameSettingsSingleton.currentTurn = GamePieceColor.Black;
                            this.messageSvc.info(this.gameSettingsSingleton.currentTurn + " must now make a move");
                        }
                    }
                }
            }
        }
    }

    /**
     * This function attempts to solve the grid under either player. It returns true if one of the players have won the game, false otherwise (i.e. no player has a valid path from one side to the other.
     */
    public checkWinState(): boolean {

        const solver: BFSSolver = new BFSSolver(this.gameSettingsSingleton.getBoardSpacesAsMatrix());

        let result: GameResult;

        for (const color of [GamePieceColor.Black, GamePieceColor.White]) {

            // Solve game with particular color
            result = solver.solve(color);

            // Quit prematurely if someone has won
            if (result.hasWon) {
                break;
            }

        }

        this.gameSettingsSingleton.currentGameResult = result;

        return result.hasWon;

    }

    renderBorder() {
        this.renderTopBorder();
        this.renderBottomBorder();
        this.renderLeftBorder();
        this.renderRightBorder();
    }

    private renderTopBorder(): void {
        // get canvas context to draw
        const ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.y
        );
        for (let i = 0; i < this.gameSettingsSingleton.cols; i++) {
            // loop through top row cells
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.y
            );
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(0, i).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.gameSettingsSingleton.COLOR_UP_DOWN;
            ctx.stroke();
        }
    }

    private renderBottomBorder(): void {
        // get canvas context to draw
        const ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.y
        );
        for (let i = 0; i < this.gameSettingsSingleton.cols; i++) {
            // loop through top row cells
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, i).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, i).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.y
            );
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, i).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(this.gameSettingsSingleton.rows - 1, i).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.gameSettingsSingleton.COLOR_UP_DOWN;
            ctx.stroke();
        }
    }

    private renderLeftBorder(): void {
        // get canvas context to draw
        const ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, 0).hexagon.getVertexBasedOnSide(HexagonSide.TopLeft).point.y
        );
        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            // loop through top row cells
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.BottomLeft).point.y
            );
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, 0).hexagon.getVertexBasedOnSide(HexagonSide.Bottom).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.gameSettingsSingleton.COLOR_LEFT_RIGHT;
            ctx.stroke();
        }
    }

    private renderRightBorder(): void {
        // get canvas context to draw
        const ctx = this.canvasSingleton.getContext();
        // render top border
        ctx.beginPath();
        // startPoint
        ctx.moveTo(
            this.gameSettingsSingleton.getSpecificBoardSpace(0, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.x,
            this.gameSettingsSingleton.getSpecificBoardSpace(0, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.Top).point.y
        );
        for (let i = 0; i < this.gameSettingsSingleton.rows; i++) {
            // loop through top row cells
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.TopRight).point.y
            );
            // -----------------------------------------------
            ctx.lineTo(
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.x,
                this.gameSettingsSingleton.getSpecificBoardSpace(i, this.gameSettingsSingleton.cols - 1).hexagon.getVertexBasedOnSide(HexagonSide.BottomRight).point.y
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.gameSettingsSingleton.COLOR_LEFT_RIGHT;
            ctx.stroke();
        }
    }
}
