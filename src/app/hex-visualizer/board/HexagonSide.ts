

export enum HexagonSide {
    BottomRight = 0,
    Bottom = 1,
    BottomLeft = 2,
    TopLeft = 3,
    Top = 4,
    TopRight = 5
}

/* 
    HexagonSide defines which vertex we are
    referring too when referencing the vertex's
    
                       Top
                        *
                       / \
                      /   \ 
                     /     \
                    /       \    
                   /         \
                  /           \
                 /             \
                /               \
               /                 \
Top-Left      *                   *   Top-Right                       
              |                   |
              |                   |                
              |                   |
              |                   |  
              |                   |
              |                   |
              |                   |
Bottom-Left   *                   *  Bottom-Right
               \                 /
                \               /
                 \             /
                  \           /
                   \         /  
                    \       /
                     \     /
                      \   /
                       \ /
                        *
                      Bottom  
    */