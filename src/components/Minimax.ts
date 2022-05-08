import { findMovesByTeam, findRawMovesByTeam, isTeamInCheck, type Move } from "./Chess";
import ComputerOpp from "./ComputerOpp";
import type Game from "./Game";

export class Tough extends ComputerOpp {
    move(game: Game): Move {
        return new Search(game.board, 4).start(game.turn);
    }
}

export class Medium extends ComputerOpp {
    move(game: Game): Move {
        return new Search(game.board, 3).start(game.turn);
    }
}

export class Easy extends ComputerOpp {
    move(game: Game): Move {
        return new Search(game.board, 2).start(game.turn);
    }
}

export class SuperEasy extends ComputerOpp {
    move(game: Game): Move {
        return new Search(game.board, 1).start(game.turn);
    }
}

class Search {

    bestMove: Move;
    searchDepth: number;
    
    board: number[][];
    searches: number = 0;
    
    constructor(board: number[][], searchDepth: number) {
        this.board = board;
        this.searchDepth = searchDepth;
    }

    start(team: boolean): Move {
        this.bestMove = null;
        this.search(this.searchDepth, -Number.MAX_VALUE, Number.MAX_VALUE, team);
        return this.bestMove;
    }

    search(depth: number, alpha: number, beta: number, team: boolean) {
        this.searches++;
        if (depth == 0) {
            return this.evaluate(team);
        }

        const moves = findMovesByTeam(this.board, team);
        if (moves.length == 0) {
            if (isTeamInCheck(this.board, team)) {
                return -Number.MAX_VALUE;
            }
            return 0;
        }

        let bestEvaluation: number = -Number.MAX_VALUE;

        for (let move of moves) {
            move.do(this.board);
            const evaluation: number = -this.search(depth - 1, -beta, -alpha, !team);
            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                if (depth == this.searchDepth) {
                    this.bestMove = move;
                }
            }
            bestEvaluation = Math.max(evaluation, bestEvaluation);
            move.undo(this.board);
            if (evaluation >= beta) {
                return beta;
            }
            alpha = Math.max(alpha, bestEvaluation);
        }

        return alpha;
    }

    evaluate(team: boolean): number {
        let total = 0;
        const moves = findRawMovesByTeam(this.board, team);
        const oppMoves = findRawMovesByTeam(this.board, !team);
        total += Math.min(moves.length, 75);
        total -= Math.min(oppMoves.length, 75);
        for (let col of this.board) {
            for (let piece of col) {
                if (piece !== -1) {
                    if (piece == 0 || piece == 1 || piece == 2) {
                        total += 100;
                    }
                    if (piece == 3 || piece == 4) {
                        total += 300;
                    }
                    if (piece == 5 || piece == 6) {
                        total += 500;
                    }
                    if (piece == 7) {
                        total += 900;
                    }

                    if (piece == 10 || piece == 11 || piece == 12) {
                        total -= 100;
                    }
                    if (piece == 13 || piece == 14) {
                        total -= 300;
                    }
                    if (piece == 15 || piece == 16) {
                        total -= 500;
                    }
                    if (piece == 17) {
                        total -= 900;
                    }
                }
            }
        }
        
        if (team) {
            return total;
        } else {
            return -total;
        }
    }

}
