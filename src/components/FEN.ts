import { algebraicNotationMatches } from "./Chess";
import Game from "./Game";

export default class FEN {

    activeColor: boolean; // true = white = w, false = black = b
    castling: string; // see https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
    enPassant: string;
    halfMoves: number;
    fullMoves: number;

    board: string;

}

export function interpret(text: string): FEN {
    const fen: string[] = text.trim().split(" ");
    // Validate FEn
    if (fen.length != 6 || !fen[4].match(/[0-9]/) || !fen[5].match(/[0-9]/) || (fen[1] != "w" && fen[1] != "b")) {
        return null;
    }
    // Elements of Fen
    const board: string = fen[0];
    const activeColor: boolean = fen[1] == "w";
    const castling: string = fen[2];
    const enPassant: string = fen[3];
    const halfMoves: number = Number.parseInt(fen[4]);
    const fullMoves: number = Number.parseInt(fen[5]);

    const result: FEN = new FEN();
    result.activeColor = activeColor;
    result.castling = castling;
    result.enPassant = enPassant;
    result.halfMoves = halfMoves;
    result.fullMoves = fullMoves;
    result.board = board;

    return result;
}

export function toGame(fen: FEN): Game {

    const game: Game = new Game();
    game.board = convertBoard(fen);
    game.turn = fen.activeColor;

    return game;
}

function convertBoard(fen: FEN): number[][] {
    const fenRows: string[] = fen.board.split("/");
    const board: number[][] = [];
    const castling: string = fen.castling;
    // white castle king, white castle queen, black castle king, black castle queen
    let wck: boolean;
    let wcq: boolean;
    let bck: boolean;
    let bcq: boolean;
    if (castling == null || castling == "-") {
        wck = wcq = bck = bcq = false;
    } else {
        if (castling.includes("K")) {
            wck = true;
        }
        if (castling.includes("Q")) {
            wcq = true;
        }
        if (castling.includes("k")) {
            bck = true;
        }
        if (castling.includes("q")) {
            bcq = true;
        }
    }
    for (let y = 0; y < fenRows.length; y++) {
        const fenRow: string[] = fenRows[y].split("");
        const row: number[] = [];
        board[y] = row;
        let x = 0;
        for (let i = 0; i < fenRow.length; i++) {
            const char = fenRow[i];
            if (char.match(/[0-9]/)) {
                const emptySpaces = Number.parseInt(char);
                for (let j = 0; j < emptySpaces; j++) {
                    row[x + j] = -1;
                }
                x += emptySpaces;
            } else {
                let piece = -1;
                switch(char) {
                    case "P":
                        piece = y == 6 ? 0 : (fen.enPassant != null && fen.enPassant != "-" && algebraicNotationMatches(fen.enPassant, x, y - 1) ? 1 : 2);
                        break;
                    case "N":
                        piece = 3;
                        break;
                    case "B":
                        piece = 4;
                        break;
                    case "R":
                        piece = (wck && x == 0 || wcq && x == 7) ? 5 : 6;
                        break;
                    case "Q":
                        piece = 7;
                        break;
                    case "K":
                        piece = 8;
                        break;
                    case "p":
                        piece = y == 1 ? 10 : (fen.enPassant != null && fen.enPassant != "-" && algebraicNotationMatches(fen.enPassant, x, y + 1) ? 11 : 12);
                        break;
                    case "n":
                        piece = 13;
                        break;
                    case "b":
                        piece = 14;
                        break;
                    case "r":
                        piece = (bck && x == 0 || bcq && x == 7) ? 15 : 16;
                        break;
                    case "q":
                        piece = 17;
                        break;
                    case "k":
                        piece = 18;
                        break;
                }
                row[x] = piece;
                x += 1;
            }
        }
    }
    return board;
}

