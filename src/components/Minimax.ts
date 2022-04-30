import { copyBoard, findMovesByTeam, isTeamInCheck, type Move } from "./Chess";

let lastMove = null;

export default function search(board: number[][], depth: number, team: boolean): Move {
    board = copyBoard(board);
    minimax(board, depth, Number.MIN_VALUE, Number.MAX_VALUE, team);
    return lastMove;
}

function minimax(board: number[][], depth: number, alpha: number, beta: number, team: boolean): number {
    if (depth == 0) return evalPos(board);

    const allMoves = findMovesByTeam(board, team);
    if (allMoves.length == 0) return evalPos(board);
    if (team) {
        let value = Number.MIN_VALUE;
        for (let move of allMoves) {
            move.do(board);
            const moveVal = minimax(board, depth - 1, alpha, beta, false);
            value = Math.max(value, moveVal);
            move.undo(board);
            alpha = Math.max(alpha, value);
            if (value >= beta) {
                break;
            }
        }
    }
    
    let value = team ? Number.MIN_VALUE : Number.MAX_VALUE;

    let bestMove = null;
    for (let move of allMoves) {
        move.do(board);
        const moveVal = minimax(board, depth - 1, alpha, beta, !team);
        if (moveVal > value) {
            if (team) {
                value = moveVal;
                bestMove = move;
            }
        } else if (!team) {
            value = moveVal;
            bestMove = move;
        }
        move.undo(board);

        if (team) {
            if (value >= beta) {
                break;
            }
            alpha = Math.max(alpha, value);
        } else {
            if (value <= alpha) {
                break;
            }
            beta = Math.min(beta, value);
        }
    }

    lastMove = bestMove;
    return value;
}

function evalPos(board: number[][]): number {
    if (isTeamInCheck(board, true)) return Number.MAX_VALUE;
    if (isTeamInCheck(board, false)) return Number.MIN_VALUE;
    let total = 0;
    for (let col of board) {
        for (let piece of col) {
            if (piece !== -1) {
                if (piece == 0 || piece == 1 || piece == 2) total += 1;
                if (piece == 3 || piece == 4) total += 3;
                if (piece == 5 || piece == 6) total += 5;
                if (piece == 7) total += 9;

                if (piece == 10 || piece == 11 || piece == 12) total -= 1;
                if (piece == 13 || piece == 14) total -= 3;
                if (piece == 15 || piece == 16) total -= 5;
                if (piece == 17) total -= 9;
            }
        }
    }
    return total;
}