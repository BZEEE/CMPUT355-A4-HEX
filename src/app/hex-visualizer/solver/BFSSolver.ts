import {BoardSpace} from '../board/BoardSpace';
import {GamePieceColor} from '../board/GamePieceColor';
import {GameSettingsSingleton} from '../GameSettingsSingleton';
import {GamePiece} from '../board/pieces/GamePiece';
import {GameResult} from './GameResult';

/**
 * This class solves a given Hex board using BFS, given a player color to check for (white or black).
 */
export class BFSSolver {

    /**
     * @param board The Hex board as a 2-dimensional nested array
     */
    constructor(board: Array<Array<BoardSpace>>) {

        this.board = board;

        this.settings = GameSettingsSingleton.getInstance();

        this.rows = this.settings.rows;
        this.cols = this.settings.cols;

    }

    private readonly board: Array<Array<BoardSpace>>;

    private readonly settings: GameSettingsSingleton;

    private readonly rows: number;
    private readonly cols: number;

    /**
     * This method builds a path in a form of an array given the parents dictionary and a particular node.
     * @param parents The parents dictionary. Every key is a string repr. of a [number, number] and every value is either a [number, number], or null.
     * @param lastNode The node (last in the path) to start analyzing the path from.
     */
    private static buildPath(parents: { [p: string]: [number, number] }, lastNode: [number, number]): Array<[number, number]> {

        const path: Array<[number, number]> = new Array<[number, number]>(lastNode);

        // While the first element of the path always has a parent, keep adding items to the array
        while (true) {

            // Get parent of the first element
            const parent = parents[path[0].toString()];

            // If it's null, we're done
            if (parent === null) {
                break;
            }

            // If not, add the parent and continue (the next iteration will deal with parent's parent).
            path.unshift(parent);

        }

        return path;

    }

    /**
     * Solves the board with the parameters given in the constructor and gives back the result.
     * @param color The color of the player to check for
     * @return true if the board has an unbroken path of pieces (of the same color) from the appropriate color's two sides -- false otherwise.
     */
    public solve(color: GamePieceColor): GameResult {

        // This is an array that acts as the main BFS queue
        const queue: Array<[number, number]> = new Array<[number, number]>();
        const parents: { [key: string]: [number, number] } = {};

        // Push appropriate start nodes for the color in the argument
        if (color === this.settings.COLOR_LEFT_RIGHT) {

            // Add the entire first column of elements (only when it has our color) to analyze first.
            for (let k = 0; k < this.rows; k++) {

                const gamePiece: GamePiece = this.board[k][0].gamePiece;

                // Only as long as the space has a piece in it and it is our color.
                if (gamePiece != null && gamePiece.getColor() === color) {
                    queue.unshift([k, 0]);
                    parents[[k, 0].toString()] = null;
                }

            }

        } else if (color === this.settings.COLOR_UP_DOWN) {

            // Add the entire first row of elements (only when it has our color) to analyze first.
            for (let k = 0; k < this.cols; k++) {

                const gamePiece: GamePiece = this.board[0][k].gamePiece;

                // Only as long as the space has a piece in it and it is our color.
                if (gamePiece != null && gamePiece.getColor() === color) {
                    queue.unshift([0, k]);
                    parents[[0, k].toString()] = null;
                }

            }

        }

        // While the queue has elements, run the algorithm
        while (queue.length !== 0) {

            // Pop the last element off of the queue, this will be the node we analyze
            const node: [number, number] = queue.pop();

            // This is the win condition for the color that is on the left and right. In particular, if we expand a node who is in the last row of the board (at index `this.rows - 1`), then we know that there is an unbroken line of that same color from one side to the other -- since the only way that we could have expanded such a node is if we followed some path from the start to the end.
            if ((color === this.settings.COLOR_LEFT_RIGHT) && (node[1] === this.cols - 1)) {
                return this.assembleResult(true, color, parents, node);
            }

            // Same logic as above, just for the up and down player
            if ((color === this.settings.COLOR_UP_DOWN) && (node[0] === this.rows - 1)) {
                return this.assembleResult(true, color, parents, node);
            }

            // For all neighbours of the current node (represented in i & j values), add the **valid** ones (one with the current color) to the queue
            for (const neighbour of this.getNeighbourNodes(node[0], node[1])) {

                // Check if this neighbour has previously been added to the queue
                if (neighbour.toString() in parents) {
                    continue;
                }

                // Access the board at the i and j position of the neighbour node and get the gamePiece.
                const gamePiece: GamePiece = this.board[neighbour[0]][neighbour[1]].gamePiece;

                // As long as the board space is not empty, we get the piece's color and compare it to our current color, only adding it to the queue if they match.
                if (gamePiece !== null && gamePiece.getColor() === color) {

                    // Array.unshift() adds an element to the beginning of the list
                    queue.unshift(neighbour);
                    parents[neighbour.toString()] = node;

                }

            }

        }

        return this.assembleResult(false, null, null, null);

    }

    /**
     * This will compute all the neighbours of a given space in the Hex board, specified by an i and j position.
     * @param i row index of the node
     * @param j column index of the node
     * @return Returns an array of grid positions that correspond to the neighbours of the source position
     */
    private getNeighbourNodes(i: number, j: number): Array<[number, number]> {

        /*
            A Hex board is (obviously), arranged into hexagons. We display the board as a rhombus (assuming the board is of equal dimension) with it slanting from the top left to the bottom right. Therefore, a 4x4 array (1-indexed) will translate to a shape like this:

                 01    02    03    04
                    05    06    07    08
                       09    10    11    12
                          13    14    15    16

            So in order to properly get the neighbours we have to "shift" our indexes when we are thinking about the grid as an array. In particular, a grid space with the full set of neighbours available would look like the following in a "flat" matrix:

                   ~   ~   *   *   ~                    ~   ~   *   *   ~
                     ~   *   #   *   ~        --->      ~   *   #   *   ~
                       ~   *   *   ~   ~                ~   *   *   ~   ~

            where the # is the source node, the *'s are its neighbours, and the ~'s are the surrounding, but unimportant nodes.
         */

        // Basic argument checking
        if (i < 0 || i > this.rows - 1) {
            throw new TypeError(`The row index given (${i}) is outside range.`);
        }

        if (j < 0 || j > this.cols - 1) {
            throw new TypeError(`The col index given (${j}) is outside range.`);
        }

        // Initialize list of neighbours
        const neighbourList: Array<[number, number]> = new Array<[number, number]>();

        // Top neighbour
        if (i > 0) {
            neighbourList.push([i - 1, j]);
        }

        // Top right corner
        if (i > 0 && j < this.cols - 1) {
            neighbourList.push([i - 1, j + 1]);
        }

        // Left neighbour
        if (j > 0) {
            neighbourList.push([i, j - 1]);
        }

        // Right neighbour
        if (j < this.cols - 1) {
            neighbourList.push([i, j + 1]);
        }

        // Bottom left corner
        if (i < this.rows - 1 && j > 0) {
            neighbourList.push([i + 1, j - 1]);
        }

        // Down neighbour
        if (i < this.rows - 1) {
            neighbourList.push([i + 1, j]);
        }

        return neighbourList;

    }

    /**
     * This method assembles statistics from the analyzed game into a GameResult object.
     * @param hasWon If the game has been won.
     * @param winner The winner, if applicable. Optional when hasWon is false.
     * @param parents The parents array used by the BFS algorithm. Optional when hasWon is false.
     * @param lastNode The last node in the path that won the game. Optional when hasWon is false.
     */
    private assembleResult(hasWon: boolean,
                           winner?: GamePieceColor,
                           parents?: { [key: string]: [number, number] },
                           lastNode?: [number, number]): GameResult {

        // Basic error checking
        if (hasWon && (winner === undefined || parents === undefined || lastNode === undefined)) {
            throw Error('Please define winner, parents, and lastNode when assembling a winning game!');
        }

        let emptySpaces = 0;
        let filledSpacesLR = 0;
        let filledSpacesUD = 0;

        // For all pieces, increment the appropriate count
        for (const row of this.board) {
            for (const piece of row) {
                if (piece.gamePiece === null) {
                    emptySpaces++;
                } else if (piece.gamePiece.getColor() === this.settings.COLOR_LEFT_RIGHT) {
                    filledSpacesLR++;
                } else if (piece.gamePiece.getColor() === this.settings.COLOR_UP_DOWN) {
                    filledSpacesUD++;
                }
            }
        }

        return new GameResult(
            hasWon,
            hasWon ? winner : null,
            hasWon ? BFSSolver.buildPath(parents, lastNode) : null,
            emptySpaces,
            filledSpacesLR,
            filledSpacesUD,
        );

    }

}
