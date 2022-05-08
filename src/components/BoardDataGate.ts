export default class BoardDataGate {

    lastHover: HTMLDivElement;
    dragging: boolean;
    spots: any[] = [];

    onEmptyDragDropped: (fromX: number, fromY: number) => void = null;

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