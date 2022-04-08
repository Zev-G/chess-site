import { defaultBoard } from "./Chess";

export default class Game {
    turn: boolean;
    board: number[][];

    constructor() {
        this.turn = true;
        this.board = defaultBoard;
    }

}