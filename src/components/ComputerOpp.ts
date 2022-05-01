import type { Move } from "./Chess";
import type Game from "./Game";
import Opponent from "./Opponent";

export default abstract class ComputerOpp extends Opponent {

    abstract move(game: Game): Move;

}