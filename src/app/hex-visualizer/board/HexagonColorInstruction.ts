
/* 
    Color instruction defines which side of the hexagon to color
    here are the indexes that corresond to each side of the hexagon
    Class is below here
                  
                 / \
                /   \ 
               /     \
  Top-Left    /       \    Top-Right
             /         \
            /           \
           /             \
          /               \
         /                 \
        /                   \                          
       |                     |
       |                     |                
       |                     |
 Left  |                     |  Right
       |                     |
       |                     |
       |                     |
        \                   /
         \                 /
          \               /
           \             /
            \           /
 Bottom-Left \         /  Bottom-Right
              \       /
               \     /
                \   /
                 \ /

    */
import { GamePieceColor } from './GamePieceColor'

 

export enum HexagonSides {
    TopRight = 0,
    TopLeft = 1,
    Left = 2,
    BottomLeft = 3,
    BottomRight = 4,
    Right = 5
}

export class HexagonSideDetails {
    color: GamePieceColor;
    width: number

    constructor(color: GamePieceColor, width: number) {
        this.color = color;
        this.width = width;
    }   
}


export class HexagonColorInstruction {
    instruction: Map<HexagonSides, HexagonSideDetails>

    constructor(inputInstruction: Map<HexagonSides, HexagonSideDetails>) {
        this.instruction = new Map<HexagonSides, HexagonSideDetails>();
        this.setDefaultValues();
        inputInstruction.forEach((value: HexagonSideDetails, key: HexagonSides) => {
            // write over any defualt instructions that were passed through input
            this.instruction.set(key, value);
        })
    }

    private setDefaultValues(): void {
        let borderSize = 1;
        this.instruction.set(HexagonSides.TopRight, new HexagonSideDetails(GamePieceColor.Black, borderSize))
        this.instruction.set(HexagonSides.TopLeft, new HexagonSideDetails(GamePieceColor.Black, borderSize))
        this.instruction.set(HexagonSides.Left, new HexagonSideDetails(GamePieceColor.Black, borderSize))
        this.instruction.set(HexagonSides.BottomLeft, new HexagonSideDetails(GamePieceColor.Black, borderSize))
        this.instruction.set(HexagonSides.BottomRight, new HexagonSideDetails(GamePieceColor.Black, borderSize))
        this.instruction.set(HexagonSides.Right, new HexagonSideDetails(GamePieceColor.Black, borderSize))
    }

    getSideDetails(index: number) {
        
    }
}