import type { Move } from "./Chess";

export default class Opponent {

    isPlayer(): boolean {
        return false;
    }

}

export class Player extends Opponent {
    isPlayer(): boolean {
        return true;
    }
}