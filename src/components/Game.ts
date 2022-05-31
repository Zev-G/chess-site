import { tick } from "svelte";
import { copyBoard, defaultBoard, findMovesByTeam, isTeamInCheck, Move, pieceKind } from "./Chess";
import type ComputerOpp from "./ComputerOpp";
import type Opponent from "./Opponent";
import { Player } from "./Opponent";

export default class Game {
    turn: boolean = true;
    board: number[][] = defaultBoard();
    positions: number[][][] = [ defaultBoard() ];
    winState: number = null;
    movesSinceProgession: number = 0;

    moveHistory: Move[] = [];

    running: boolean = true;

    _blackController: Opponent = new Player();
    _whiteController: Opponent = new Player();
    set blackController(player: Opponent) {
        this._blackController = player;
        if (!this.turn && !player.isPlayer()) {
            this.doMove((this._blackController as ComputerOpp).move(this));
        }
    }
    set whiteController(player: Opponent) {        
        this._whiteController = player;
        if (this.turn && !player.isPlayer()) {
            this.doMove((this._whiteController as ComputerOpp).move(this));
        }
    }
    get blackController() { return this._blackController; }
    get whiteController() { return this._whiteController; }

    aiDelayAfter: number = 300;
    aiDelayBefore: number = 100;

    onMove: (move: Move, board: number[][]) => void = () => {};

    async doMove(move: Move) {        
        if (pieceKind(move.pieces[0]) != 0 && this.board[move.y][move.x] == -1) {
            this.movesSinceProgession++;
        } else {
            this.movesSinceProgession = 0;
        }
        if (!this.controller(this.turn).isPlayer()) {
            await new Promise(r => setTimeout(r, this.aiDelayBefore));
        }
        if (!this.running) return;
        let prevBoard = copyBoard(this.board);
        move.do(this.board);
        this.moveHistory = [...this.moveHistory, move];
        this.positions.push(copyBoard(this.board));
        this.turn = !this.turn;
        this.winState = this.checkWinState();
        this.onMove(move, prevBoard);
        if (this.running) {
            if (!this.controller(!this.turn).isPlayer()) {
                await new Promise(r => setTimeout(r, this.aiDelayAfter));
            }
    
            if (this.winState == null && !this.controller(this.turn).isPlayer()) {
                let controller = this.controller(this.turn) as ComputerOpp;
                this.doMove(controller.move(this));
            }
        }
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

    controller(team: boolean) {
        return team ? this.whiteController : this.blackController;
    }

    stop() {
        this.running = false;
    }

}