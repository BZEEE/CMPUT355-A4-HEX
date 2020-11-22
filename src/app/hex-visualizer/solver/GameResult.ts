import {GamePieceColor} from '../board/GamePieceColor';

/**
 * This represents a particular result of a game after solving. This includes a myriad of statistics.
 */
export class GameResult {

    // Whether the game has been won or not.
    public readonly hasWon: boolean;

    // These should only be accessed when the game is solved. A GameColor means that this state is solved, while a null means that it's undetermined. The same idea goes for winningPath.
    public readonly winner: GamePieceColor | null;
    public readonly winningPath: Array<[number, number]> | null;

    // Number of empty spaces on the board
    public readonly emptySpaces: number;

    // Number of spaces that are filled with each color (LR player, and UD player).
    public readonly filledSpacesLR: number;
    public readonly filledSpacesUD: number;

    constructor(hasWon: boolean, winner: GamePieceColor | null, winningPath: Array<[number, number]> | null, emptySpaces: number, filledSpacesLR: number, filledSpacesUD: number) {
        this.hasWon = hasWon;
        this.winner = winner;
        this.winningPath = winningPath;
        this.emptySpaces = emptySpaces;
        this.filledSpacesLR = filledSpacesLR;
        this.filledSpacesUD = filledSpacesUD;
    }
}
