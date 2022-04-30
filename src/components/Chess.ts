
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
export function defaultBoard(): number[][] {
    return [
        [15, 13, 14, 17, 18, 14, 13, 15],
        [10, 10, 10, 10, 10, 10, 10, 10],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [0,  0,  0,  0,  0,  0,  0,  0 ],
        [5,  3,  4,  7,  8,  4,  3,  5 ]
    ];
}

export function copyBoard(board: number[][]): number[][] {
    return [
        [...board[0]],
        [...board[1]],
        [...board[2]],
        [...board[3]],
        [...board[4]],
        [...board[5]],
        [...board[6]],
        [...board[7]],
    ];
}

export type Piece = {
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
    return pieceTeam(board[y][x]) === !team;
}

export function isEmpty(board: number[][], x: number, y: number): boolean {
    return board[y][x] == -1;
}

export function isEnemyOrEmpty(board: number[][], team: boolean, x: number, y: number): boolean {
    return isEmpty(board, x, y) || isEnemy(board, team, x, y);
}

export function isValid(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

export function findPiecesOnTeam(board: number[][], team: boolean): Piece[] {
    let pieces: Piece[] = [];
    for (let y = 0, boardLen = board.length; y < boardLen; y++) {
        for (let x = 0, colLen = board[y].length; x < colLen; x++) {
            let piece = board[y][x];
            if (piece != -1 && pieceTeam(piece) === team) {
                pieces.push({
                    type: piece,
                    x, y
                });
            }
        }
    }
    return pieces;
}

export function findKing(board, team): Piece {
    for (let y = 0, boardLen = board.length; y < boardLen; y++) {
        for (let x = 0, colLen = board[y].length; x < colLen; x++) {
            let piece = board[y][x];
            if (piece != -1 && pieceTeam(piece) === team && pieceKind(piece) === 5) {
                return {
                    type: piece,
                    x, y
                };
            }
        }
    }
    return null;
}

export function findRawMovesByTeam(board: number[][], team: boolean) {
    return findPiecesOnTeam(board, team).map(piece => findRawMoves(piece, board)).reduce((a, b) => a.concat(b));
}
export function findMovesByTeam(board: number[][], team: boolean) {
    return findPiecesOnTeam(board, team).map(piece => findMoves(piece, board)).reduce((a, b) => a.concat(b));
}

export function isTeamInCheck(board: number[][], team: boolean): boolean {
    let enemyMoves: Move[] = findRawMovesByTeam(board, !team);
    let king = findKing(board, team);
    for (let move of enemyMoves) {
        if (move.x == king.x && move.y == king.y) return true;
    }
    return false;
}

export function enemyMovedForwardTwo(piece: number, team: boolean) {
    return piece == (team ? 11 : 1)
}

export function pawnHasNotMoved(pawn: number): boolean {
    return pawn == 0 || pawn == 10;
}
export function findMoves(piece: Piece, board: number[][]): Move[] {
    let moves: Move[] = findRawMoves(piece, board);
    const type = piece.type;
    const team = pieceTeam(type);
    moves = moves.filter(move => {
        move.do(board);
        const answer = isTeamInCheck(board, team);
        move.undo(board);
        return !answer;
    });
    return moves;
}
export function findRawMoves(piece: Piece, board: number[][], checkCastling: boolean = true): Move[] {
    let { type, x, y } = piece;
    if (type == -1) return [];
    let pieceType: number = pieceKind(type);
    let team = pieceTeam(type);

    let moves: Move[] = [];
    // Pawn movement
    if (pieceType == 0) {
        // Move forward 1
        let displace = team ? -1 : 1;
        if (isValid(x, y + displace) && isEmpty(board, x, y + displace)) {
            if (y == (team ? 1 : 6)) {
                if (team) {
                    moves.push(new PawnPromotion(type, 7, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 6, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 4, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 3, x, y, x, y + displace));
                } else {
                    moves.push(new PawnPromotion(type, 17, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 16, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 14, x, y, x, y + displace));
                    moves.push(new PawnPromotion(type, 13, x, y, x, y + displace));
                }
            } else {
                moves.push(new PawnMove(type, x, y, x, y + displace));
            }
        }
        // Basic taking
        if (isValid(x + 1, y + displace) && isEnemy(board, team, x + 1, y + displace)) {    
            if (y == (team ? 1 : 6)) {
                if (team) {
                    moves.push(new PawnPromotion(type, 7, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 6, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 4, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 3, x, y, x + 1, y + displace));
                } else {
                    moves.push(new PawnPromotion(type, 17, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 16, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 13, x, y, x + 1, y + displace));
                    moves.push(new PawnPromotion(type, 14, x, y, x + 1, y + displace));
                }
            } else {
                moves.push(new PawnMove(type, x, y, x + 1, y + displace));
            }
        }
        if (isValid(x - 1, y + displace) && isEnemy(board, team, x - 1, y + displace)) {
            if (y == (team ? 1 : 6)) {
                if (team) {
                    moves.push(new PawnPromotion(type, 7, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 6, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 4, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 3, x, y, x - 1, y + displace));
                } else {
                    moves.push(new PawnPromotion(type, 17, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 16, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 14, x, y, x - 1, y + displace));
                    moves.push(new PawnPromotion(type, 13, x, y, x - 1, y + displace));
                }
            } else {
                moves.push(new PawnMove(type, x, y, x - 1, y + displace));
            }
        }
        // Move forawrd two:
        if (isValid(x, y + displace * 2) && pawnHasNotMoved(type) && isEmpty(board, x, y + displace * 2) && isEmpty(board, x, y + displace)) {
            moves.push(new PawnMoveTwoForward(type, x, y, x, y + displace * 2));
        }

        // En passant
        if (isValid(x - 1, y) && isValid(x - 1, y + displace) && enemyMovedForwardTwo(board[y][x - 1], team)) {
            moves.push(new EnPassantMove(team, -1, x, y, x - 1, y + displace));
        }
        if (isValid(x + 1, y) && isValid(x + 1, y + displace) && enemyMovedForwardTwo(board[y][x + 1], team)) {
            moves.push(new EnPassantMove(team, 1, x, y, x + 1, y + displace));
        }
    }
    // Knight movement
    else if (pieceType == 1) {
        if (isValid(x + 1, y + 2) && isEnemyOrEmpty(board, team, x + 1, y + 2)) {
            moves.push(new SimpleMove(type, x, y, x + 1, y + 2));
        }
        if (isValid(x + 1, y - 2) && isEnemyOrEmpty(board, team, x + 1, y - 2)) {
            moves.push(new SimpleMove(type, x, y, x + 1, y - 2));
        }
        if (isValid(x - 1, y + 2) && isEnemyOrEmpty(board, team, x - 1, y + 2)) {
            moves.push(new SimpleMove(type, x, y, x - 1, y + 2));
        }
        if (isValid(x - 1, y - 2) && isEnemyOrEmpty(board, team, x - 1, y - 2)) {
            moves.push(new SimpleMove(type, x, y, x - 1, y - 2));
        }

        if (isValid(x + 2, y + 1) && isEnemyOrEmpty(board, team, x + 2, y + 1)) {
            moves.push(new SimpleMove(type, x, y, x + 2, y + 1));
        }
        if (isValid(x + 2, y - 1) && isEnemyOrEmpty(board, team, x + 2, y - 1)) {
            moves.push(new SimpleMove(type, x, y, x + 2, y - 1));
        }
        if (isValid(x - 2, y + 1) && isEnemyOrEmpty(board, team, x - 2, y + 1)) {
            moves.push(new SimpleMove(type, x, y, x - 2, y + 1));
        }
        if (isValid(x - 2, y - 1) && isEnemyOrEmpty(board, team, x - 2, y - 1)) {
            moves.push(new SimpleMove(type, x, y, x - 2, y - 1));
        }
    }
    // Bishop movement
    else if (pieceType == 2 || pieceType == 4) {
        let xOffset = 1;
        let yOffset = 1;
        let i = 1;
        const bishopMoves = () => {
            while (isValid(x + xOffset * i, y + yOffset * i) && (isEmpty(board, x + xOffset * i, y + yOffset * i) || isEnemy(board, team, x + xOffset * i, y + yOffset * i))) {
                moves.push(new SimpleMove(type, x, y, x + xOffset * i, y + yOffset * i));
                if (!isEmpty(board, x + xOffset * i, y + yOffset * i)) {
                    break;
                }
                i++;
            }
        };
        bishopMoves();
        i = 1;
        xOffset = 1;
        yOffset = -1;
        bishopMoves();
        i = 1;
        xOffset = -1;
        yOffset = 1;
        bishopMoves();
        i = 1;
        xOffset = -1;
        yOffset = -1;
        bishopMoves();
    }
    // Rook movement
    if (pieceType == 3 || pieceType == 4) {
        let xOffset = 0;
        let yOffset = 1;
        let i = 1;
        const rookMoves = () => {
            while (isValid(x + xOffset * i, y + yOffset * i) && (isEmpty(board, x + xOffset * i, y + yOffset * i) || isEnemy(board, team, x + xOffset * i, y + yOffset * i))) {
                if (pieceType == 3) {
                    moves.push(new UpdateType(type, (team ? 6 : 16), x, y, x + xOffset * i, y + yOffset * i));
                } else /* IMPLIED: (pieceType == 4) */ {
                    moves.push(new SimpleMove(type, x, y, x + xOffset * i, y + yOffset * i));
                }
                if (!isEmpty(board, x + xOffset * i, y + yOffset * i)) {
                    break;
                }
                i++;
            }
        };
        rookMoves();
        i = 1;
        xOffset = 0;
        yOffset = -1;
        rookMoves();
        i = 1;
        xOffset = 1;
        yOffset = 0;
        rookMoves();
        i = 1;
        xOffset = -1;
        yOffset = 0;
        rookMoves();
    }
    // King movement
    else if (pieceType == 5) {
        // Normal movement
        if (isValid(x + 1, y + 1) && isEnemyOrEmpty(board, team, x + 1, y + 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x + 1, y + 1));
        }
        if (isValid(x, y + 1) && isEnemyOrEmpty(board, team, x, y + 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x, y + 1));
        }
        if (isValid(x - 1, y + 1) && isEnemyOrEmpty(board, team, x - 1, y + 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x - 1, y + 1));
        }
        if (isValid(x + 1, y) && isEnemyOrEmpty(board, team, x + 1, y)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x + 1, y));
        }
        if (isValid(x - 1, y) && isEnemyOrEmpty(board, team, x - 1, y)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x - 1, y));
        }
        if (isValid(x + 1, y - 1) && isEnemyOrEmpty(board, team, x + 1, y - 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x + 1, y - 1));
        }
        if (isValid(x, y - 1) && isEnemyOrEmpty(board, team, x, y - 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x, y - 1));
        }
        if (isValid(x - 1, y - 1) && isEnemyOrEmpty(board, team, x - 1, y - 1)) {
            moves.push(new UpdateType(type, (team ? 9 : 19), x, y, x - 1, y - 1));
        }
        // Castling
        // Check if king hasn't moved
        if (checkCastling && (type == 8 || type == 18)) {
            const castleLeft = board[y][0] == (team ? 5 : 15) && board[y][1] == -1 && board[y][2] == -1 && board[y][3] == -1;
            const castleRight = board[y][7] == (team ? 5 : 15) && board[y][5] == -1 && board[y][6] == -1;
            if (castleLeft || castleRight) {
                // Generate opponent moves
                const oppMoves: Move[] = findPiecesOnTeam(board, !team)
                    .map(piece => findRawMoves(piece, board, false))
                    .reduce((a, b) => a.concat(b));
                const spotIsSafe = (x: number, y: number): boolean => {
                    for (let move of oppMoves) {
                        if (move.x == x && move.y == y) return true;
                    }
                    return true;
                }
                if (spotIsSafe(x, y)) {
                    if (castleLeft && spotIsSafe(3, y)) {
                        moves.push(new CastleMove(piece, {
                            type: (team) ? 5 : 15,
                            x: 0,
                            y
                        }));
                    }
                    if (castleRight && spotIsSafe(5, y)) {
                        moves.push(new CastleMove(piece, {
                            type: (team) ? 5 : 15,
                            x: 7,
                            y
                        }));
                    }
                }
            }
        }
    }

    return moves;
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

class UpdateType extends Move {

    fromX: number;
    fromY: number;
    initalValue: number;
    replacement: number;

    constructor(piece: number, replacenment: number, fromX: number, fromY: number, x: number, y: number) {
        super([ piece ], x, y);
        this.fromX = fromX;
        this.fromY = fromY;
        this.replacement = replacenment;
    }

    do(board: number[][]): void {
        this.initalValue = board[this.y][this.x];
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.replacement;
    }
    undo(board: number[][]): void {
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = this.initalValue;
    }

}

export class PawnPromotion extends UpdateType {

}


class SimpleMove extends Move {

    fromX: number;
    fromY: number;
    initalValue: number;

    constructor(piece: number, fromX: number, fromY: number, x: number, y: number) {
        super([ piece ], x, y);
        this.fromX = fromX;
        this.fromY = fromY;
    }

    do(board: number[][]): void {
        this.initalValue = board[this.y][this.x];
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.pieces[0];
    }
    undo(board: number[][]): void {
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = this.initalValue;
    }

}

class PawnMoveTwoForward extends Move {

    fromX: number;
    fromY: number;
    replacement: number;

    constructor(piece: number, fromX: number, fromY: number, x: number, y: number) {
        super([ piece ], x, y);
        this.fromX = fromX;
        this.fromY = fromY;
        
        this.replacement = piece + 1;
    }

    do(board: number[][]): void {
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.replacement;
    }
    undo(board: number[][]): void {
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = -1;
    }

}

class PawnMove extends Move {

    fromX: number;
    fromY: number;
    replacement: number;
    initalValue: number;

    constructor(piece: number, fromX: number, fromY: number, x: number, y: number) {
        super([ piece ], x, y);
        this.fromX = fromX;
        this.fromY = fromY;
        
        if (piece < 10) this.replacement = 2;
        else this.replacement = 12;
    }

    do(board: number[][]): void {
        this.initalValue = board[this.y][this.x];
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.replacement;
    }
    undo(board: number[][]): void {
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = this.initalValue;
    }

}

class CastleMove extends Move {

    replaceKing: number;
    replaceRook: number;
    rookFromX: number;
    rookToX: number;
    kingFromX: number;

    constructor(king: Piece, rook: Piece) {
        super([ king.type, rook.type ], (rook.x > king.x ? 6 : 2), king.y);
        if (pieceTeam(king.type)) {
            this.replaceKing = 9;
            this.replaceRook = 6;
        } else {
            this.replaceKing = 19;
            this.replaceRook = 16;
        }
        this.rookFromX = rook.x;
        this.kingFromX = king.x;
        this.rookToX = (rook.x > king.x) ? 5 : 3;
    }

    do(board: number[][]): void {
        board[this.y][this.kingFromX] = -1;
        board[this.y][this.rookFromX] = -1;
        board[this.y][this.x] = this.replaceKing;
        board[this.y][this.rookToX] = this.replaceRook;
    }

    undo(board: number[][]): void {
        board[this.y][this.x] = -1;
        board[this.y][this.rookToX] = -1;
        board[this.y][this.kingFromX] = this.pieces[0];
        board[this.y][this.rookFromX] = this.pieces[1];
    }

}

class EnPassantMove extends Move {
    
    takeX: number;
    fromX: number;
    fromY: number;

    constructor(team: boolean, takeX: number, fromX: number, fromY: number, x: number, y: number) {
        super((team ? [ 0, 11 ] : [ 10, 1]), x, y);
        this.takeX = takeX;
        this.fromX = fromX;
        this.fromY = fromY;
    }

    do(board: number[][]): void {
        board[this.fromY][this.fromX + this.takeX] = -1;
        board[this.fromY][this.fromX] = -1;
        board[this.y][this.x] = this.pieces[0];
    }

    undo(board: number[][]): void {
        board[this.fromY][this.fromX + this.takeX] = this.pieces[1];
        board[this.fromY][this.fromX] = this.pieces[0];
        board[this.y][this.x] = -1;
    }

}