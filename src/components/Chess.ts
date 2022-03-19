
/*

Pieces:
-1: nothing
0: white pawn (hasn't moved)
1: white pawn (has moved 2 places last turn)
2: white pawn (has moved)
3: white knight
4: white bishop
5: white rook (hasn't moved)
6: white rook (has moved)
7: white queen
8: white king (hasn't moved)
9: white king (has moved)
10: black pawn (hasn't moved)
11: black pawn (has moved 2 places last turn)
12: black pawn (has moved)
13: black knight
14: black bishop
15: black rook (hasn't moved)
16: black rook (has moved)
17: black queen
18: black king (hasn't moved)
19: black king (has moved)

*/

export const images = {
    white: {
        pawn:   "/white/pawn.png",
        knight: "/white/knight.png",
        bishop: "/white/bishop.png",
        rook:   "/white/rook.png",
        queen:  "/white/queen.png",
        king:   "/white/king.png"
    },
    black: {
        pawn:   "/black/pawn.png",
        knight: "/black/knight.png",
        bishop: "/black/bishop.png",
        rook:   "/black/rook.png",
        queen:  "/black/queen.png",
        king:   "/black/king.png"
    }
};

export const imageMap = [
    images.white.pawn,
    images.white.pawn,
    images.white.pawn,
    images.white.knight,
    images.white.bishop,
    images.white.rook,
    images.white.rook,
    images.white.queen,
    images.white.king,
    images.white.king,
    images.black.pawn,
    images.black.pawn,
    images.black.pawn,
    images.black.knight,
    images.black.bishop,
    images.black.rook,
    images.black.rook,
    images.black.queen,
    images.black.king,
    images.black.king
]

// Y then X indexing, i.e. defaultBoard[2][0] refers to board position y = 2, x = 0
export const defaultBoard: number[][] = [
    [15, 13, 14, 17, 18, 14, 13, 15],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0,  0,  0,  0,  0,  0,  0,  0 ],
    [5,  3,  4,  7,  8,  4,  3,  5 ]
];

export abstract class Move {
    pieces: number[];

    constructor(pieces: number[]) {
        this.pieces = pieces;
    }

    abstract do(): void;
    abstract undo(): void;
}

export class Game {
    board: number[][];
}