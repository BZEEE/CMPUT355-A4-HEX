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
    }

    public execute(): void {
        let space: BoardSpace = this.gameSettings.getSpecificBoardSpace(this.move.rowIndex, this.move.colIndex)
        space.gamePiece = null
    }

    public unexecute(): void {
        let space: BoardSpace = this.gameSettings.getSpecificBoardSpace(this.move.rowIndex, this.move.colIndex)
        if (this.move.gamePiece === GamePieceColor.Black) {
            space.gamePiece = new BlackPiece(space.hexagon.origin, this.gameSettings.getGamePieceRadius());
        } else if (this.move.gamePiece === GamePieceColor.White) {
            space.gamePiece = new WhitePiece(space.hexagon.origin, this.gameSettings.getGamePieceRadius());
        }
    }

    public isReversible(): boolean {
        return true;
    }
}
   