export default class BoardDataGate {

    lastHover: HTMLDivElement;
    dragging: boolean;
    spots: any[] = [];
    animating: boolean = false;

    onEmptyDragDropped: (fromX: number, fromY: number) => void = null;

    onDragLeft: (x: number, y: number) => void = null;

    dragDropped(x: number, y: number, posX: number, posY: number) {
        for (let spot of this.spots) {
            if (spot.overlaps(x, y)) {
                spot.dragDropped(posX, posY);
                return;
            }
        }
        if (this.onEmptyDragDropped != null) {
            this.onEmptyDragDropped(posX, posY);
        }
    }

}