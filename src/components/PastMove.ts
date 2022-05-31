import { CastleMove, pieceKind, pieceName, pieceTeam, stringLocation, type Move } from "./Chess";

export default class PastMove {

    victim: number = -1;
    moving: number = -1;
    ogX: number = -1;
    ogY: number = -1;
    x: number = -1;
    y: number = -1;
    castling: boolean = false;
    originalMove: Move;

    static convertMove(move: Move, board: number[][]): PastMove {
        const pastMove = new PastMove();
        pastMove.victim = board[move.y][move.x];
        pastMove.moving = move.pieces[0];
        pastMove.ogX = move.fromX;
        pastMove.ogY = move.fromY;
        pastMove.x = move.x;
        pastMove.y = move.y;
        pastMove.castling = pastMove instanceof CastleMove;
        pastMove.originalMove = move;
        return pastMove;
    }

    formattedString(): string {
        const team = pieceTeam(this.moving);
        if (this.castling) {
            // ex: White king castled king-side
            const side = `${this.x == 0 ? "queen" : "king"}`;
            return `${team ? "White" : "Black"} king castled ${side}-side`;
        }
        if (this.victim != -1) {
            return `${team ? "White" : "Black"} ${pieceName(pieceKind(this.moving))} (${stringLocation(this.ogX, this.ogY)}) took ${pieceTeam(this.victim) ? "White" : "Black"} ${pieceName(pieceKind(this.victim))} (${stringLocation(this.x, this.y)})`;
        }
        return `${team ? "White" : "Black"} ${pieceName(pieceKind(this.moving))} from ${stringLocation(this.ogX, this.ogY)} to ${stringLocation(this.x, this.y)}`;
    }

}