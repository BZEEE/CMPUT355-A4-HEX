import {BoardSpace} from './board/BoardSpace';
import {Hexagon} from './board/Hexagon';
import {GamePiece} from './board/pieces/GamePiece';
import {GamePieceColor} from './board/GamePieceColor';
import {GameResult} from './solver/GameResult';


export class GameSettingsSingleton {

    private static singleton: GameSettingsSingleton = null;

    // This defines which side the black and white borders go. This must be known for the solver. Changing the values here will change it for the rendering too -- so it stays consistent with the solver and what you see.
    public readonly COLOR_LEFT_RIGHT: GamePieceColor = GamePieceColor.Black;
    public readonly COLOR_UP_DOWN: GamePieceColor = GamePieceColor.White;

    public rows: number;
    public cols: number;

    public currentTurn: string;

    public currentGameResult: GameResult;

    public running: boolean;

    public tutorialMode: boolean;

    private boardMatrix: Array<Array<BoardSpace>>;

    private hexagonRadius: number;
    private gamePieceRadius: number;

    private constructor() {
    }

    public static getInstance() {
        if (this.singleton == null) {
            this.singleton = new GameSettingsSingleton();
        }
        return this.singleton;
    }

    public setRadius(radius: number) {
        // make the game pieces (black/white stones) half the size of the hexagon board space tiles
        this.hexagonRadius = radius;
        this.gamePieceRadius = Math.round(radius / 2);
    }

    public getHexagonRadius(): number {
        return this.hexagonRadius;
    }

    public getGamePieceRadius(): number {
        return this.gamePieceRadius;
    }

    public resetBoardMatrix() {
        this.boardMatrix = [];
    }

    public addRowToBoardMatrix(row: BoardSpace[]) {
        this.boardMatrix.push(row);
    }

    public getSpecificBoardSpace(rowIndex: number, colIndex: number): BoardSpace {
        return this.boardMatrix[rowIndex][colIndex];
    }

    public getAllBoardSpaces(): BoardSpace[] {
        let output: BoardSpace[] = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                output.push(this.boardMatrix[i][j]);
            }
        }
        return output;
    }

    public getBoardSpacesAsMatrix(): Array<Array<BoardSpace>> {
        return this.boardMatrix;
    }

    public getHexagonsInBoard(): Hexagon[] {
        let output: Hexagon[] = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                output.push(this.boardMatrix[i][j].hexagon);
            }
        }
        return output;
    }

    public getGamePiecesInBoard(): GamePiece[] {
        let output: GamePiece[] = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                output.push(this.boardMatrix[i][j].gamePiece);
            }
        }
        return output;
    }
}
