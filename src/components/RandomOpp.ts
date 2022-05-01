import { findMoves, findMovesByTeam, type Move } from "./Chess";
import ComputerOpp from "./ComputerOpp";
import type Game from "./Game";

export default class RandomOpp extends ComputerOpp {

    move(game: Game): Move {
        const moves = findMovesByTeam(game.board, game.turn);
        if (moves.length == 0) return null;
        return moves[Math.floor((moves.length - 1) * Math.random())]
    }

}