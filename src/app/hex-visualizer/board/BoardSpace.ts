import { Hexagon } from './Hexagon';
import { GamePiece } from './pieces/GamePiece';


export class BoardSpace {
    public hexagon: Hexagon
    public gamePiece: GamePiece

    constructor(hexagon: Hexagon, gamePiece: GamePiece) {
        this.hexagon = hexagon
        this.gamePiece = gamePiece
    }
}