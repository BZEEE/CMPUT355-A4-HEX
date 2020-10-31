import { GamePieceColor } from '../board/GamePieceColor';


export class Move {
    rowIndex: number;
    colIndex: number;
    gamePiece: GamePieceColor

    constructor(rowIndex: number, colIndex: number, gamePiece: GamePieceColor) {
        this.rowIndex = rowIndex
        this.colIndex = colIndex
        this.gamePiece = gamePiece
    }
}