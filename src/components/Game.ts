import { defaultBoard, findMovesByTeam, isTeamInCheck, Move } from "./Chess";

export default class Game {
    turn: boolean;
    board: number[][];

    constructor() {
        this.turn = true;
        this.board = defaultBoard();
        
    }

    /*
        Returns:
        0 if game is a stalemate / tie
        -1 if black won
        1 if white won
        null if game is still going
    */
    checkWinState(): number {
        const moves: Move[] = findMovesByTeam(this.board, this.turn);
        
        if (moves.length !== 0) return null;
        if (isTeamInCheck(this.board, this.turn)) return this.turn ? -1 : 1;
        return 0;
    }

}