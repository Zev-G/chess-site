
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
    [-1, -1, -1, 10, -1, -1, -1, -1],
    [0,  0,  0,  0,  0,  0,  0,  0 ],
    [5,  3,  4,  7,  8,  4,  3,  5 ]
];

type Piece = {
    type: number,
    x: number,
    y: number
}

export function pieceTeam(type: number): boolean {
    if (type == -1) return null;
    else if (type < 10) return true;
    else if (type <= 19) return false;
    else {
        console.error(`Inputted piece type: ${type} isn't a valid piece.`);
    }
}

// 0: Pawn
// 1: Knight
// 2: Bishop
// 3: Rook
// 4: Queen
// 5: King
export function pieceKind(type: number): any {
    if (type <= -1) return null;
    if (type == 0 || type == 1 || type == 2 || type == 10 || type == 11 || type == 12) return 0;
    if (type == 3 || type == 13) return 1;
    if (type == 4 || type == 14) return 2;
    if (type == 5 || type == 6 || type == 15 || type == 16) return 3;
    if (type == 7 || type == 17) return 4;
    if (type == 8 || type == 9 || type == 18 || type == 19) return 5;
    return null;
}

export function isEnemy(board: number[][], team: boolean, x: number, y: number): boolean {
    return pieceTeam(board[y][x]) != team;
}

export function isEmpty(board: number[][], x: number, y: number): boolean {
    return board[y][x] == -1;
}

export function isValid(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

export function pawnHasNotMoved(pawn: number) {
    return pawn == 0 || pawn == 10;
}
export function findMoves(piece: Piece, board: number[][]): Move[] {
    let { type, x, y } = piece;
    if (type == -1) return [];
    let pieceType: number = pieceKind(type);
    let team = pieceTeam(type);

    // Pawn movement
    if (pieceType == 0) {
        let moves: Move[] = [];
        // Move forward 1
        let displace = team ? -1 : 1;
        if (isValid(x, y + displace) && isEmpty(board, x, y + displace)) {
            moves.push(new SimpleMove(type, x, y, x, y + displace));
        }
        // Take
        if (isValid(x + 1, y + displace) && isEnemy(board, team, x + 1, y + displace)) {            
            moves.push(new SimpleMove(type, x, y, x + 1, y + displace));
        }
        if (isValid(x - 1, y + displace) && isEnemy(board, team, x - 1, y + displace)) {
            moves.push(new SimpleMove(type, x, y, x - 1, y + displace));
        }
        // Move forawrd two:
        if (isValid(x, y + displace * 2) && pawnHasNotMoved(type) && isEmpty(board, x, y + displace * 2) && isEmpty(board, x, y + displace)) {
            moves.push(new SimpleMove(type, x, y, x, y + displace * 2));
        }
        return moves;
    }

    // Knight movement
    if (pieceType == 1) {

    }
}

export abstract class Move {
    pieces: number[];
    x: number;
    y: number;

    constructor(pieces: number[], x: number, y: number) {
        this.pieces = pieces;
        this.x = x;
        this.y = y;
    }

    abstract do(board: number[][]): void;
    abstract undo(board: number[][]): void;
}

export class SimpleMove extends Move {

    fromX: number;
    fromY: number;
    initalValue: number;

    constructor(piece: number, fromX: number, fromY: number, x: number, y: number) {
        super([ piece ], x, y);
        this.fromX = fromX;
        this.fromY = fromY;
    }

    do(board: number[][]): void {
        this.initalValue = board[this.x][this.y];
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.pieces[0];
    }
    undo(board: number[][]): void {
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = this.initalValue;
    }

    
}

export class Game {
    board: number[][];

    constructor(board: number[][]) {
        this.board = board;
    }
}