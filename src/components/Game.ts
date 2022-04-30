import { copyBoard, defaultBoard, findMovesByTeam, isTeamInCheck, Move, pieceKind } from "./Chess";

export default class Game {
    turn: boolean = true;
    board: number[][] = defaultBoard();
    positions: number[][][] = [ defaultBoard() ];
    winState: number = null;
    movesSinceProgession: number = 0;

    doMove(move: Move) {
        if (pieceKind(move.pieces[0]) != 0 && this.board[move.y][move.x] == -1) {
            this.movesSinceProgession++;            
        } else {
            this.movesSinceProgession = 0;
        }
        move.do(this.board);
        this.positions.push(copyBoard(this.board));
        this.turn = !this.turn;
        this.winState = this.checkWinState();
    }

    /*
        Returns:
        0 if game is a stalemate / tie
        -1 if black won
        1 if white won
        null if game is still going
    */
    checkWinState(): number {
        if (this.movesSinceProgession >= 50 || this.repeated()) return 0;

        const moves: Move[] = findMovesByTeam(this.board, this.turn);
        
        if (moves.length !== 0) return null;
        if (isTeamInCheck(this.board, this.turn)) return this.turn ? -1 : 1;
        return 0;
    }

    repeated(): boolean {
        const history = [...this.positions];
        history.pop();
        let repeats: number = 1;
        let pos: number;
        while ((pos = this.findBoardInHistory(this.board, history)) != -1) {
            history.splice(pos, 1);
            repeats++;
            if (repeats == 3) return true;
        }
        return false;
    }

    findBoardInHistory(board: number[][], history: number[][][]) {
        for (let i = 0; i < history.length; i++) {
            if (board.toString() === history[i].toString()) {
                return i;
            }
        }
        return -1;
    }

}