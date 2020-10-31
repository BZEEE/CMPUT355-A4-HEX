import { BoardSpace } from '../board/BoardSpace';
import { GamePieceColor } from '../board/GamePieceColor';
import { BlackPiece } from '../board/pieces/BlackPiece';
import { GamePiece } from '../board/pieces/GamePiece';
import { WhitePiece } from '../board/pieces/WhitePiece';
import { GameSettingsSingleton } from '../GameSettingsSingleton';
import { ICommand } from './ICommand';
import { Move } from './Move';


export class MoveCommand implements ICommand {
    private gameSettings: GameSettingsSingleton; // a receiver (the game board or hex grid), in our case we are directly affecting the game board with the commands
    private move: Move

    public constructor(move: Move) {
        this.gameSettings = GameSettingsSingleton.getInstance()
        this.move = move
    }

    public execute(): void {
        let space: BoardSpace = this.gameSettings.getSpecificBoardSpace(this.move.rowIndex, this.move.colIndex)
        if (this.move.gamePiece === GamePieceColor.Black) {
            space.gamePiece = new BlackPiece(space.hexagon.origin, this.gameSettings.getGamePieceRadius());
            // just replaced a black stone on the board so now its white's turn
            this.gameSettings.currentTurn = GamePieceColor.White;
        } else if (this.move.gamePiece === GamePieceColor.White) {
            space.gamePiece = new WhitePiece(space.hexagon.origin, this.gameSettings.getGamePieceRadius());
            // just replaced a white stone on the board so now its black's turn
            this.gameSettings.currentTurn = GamePieceColor.Black;
        }
    }

    public unexecute(): void {
        let space: BoardSpace = this.gameSettings.getSpecificBoardSpace(this.move.rowIndex, this.move.colIndex)
        space.gamePiece = null
        if (this.move.gamePiece === GamePieceColor.Black) {
            // just just took away a black stone on the board so now it remains black's turn
            this.gameSettings.currentTurn = GamePieceColor.Black;
        } else if (this.move.gamePiece === GamePieceColor.White) {
            // just took away a white stone on the board so now it remains white's turn
            this.gameSettings.currentTurn = GamePieceColor.White;
        }
    }

    public isReversible(): boolean {
        return true;
    }
}
   