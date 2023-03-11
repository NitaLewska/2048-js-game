export class Cell {
    constructor(gridElement, x, y) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        gridElement.append(cell)
        this.x = x
        this.y = y
    }

    linkTile(tile) {
        tile.setXY(this.x, this.y)
        this.linkedTile = tile
    }

    isEmpty() {
        return !this.linkedTile
    }

    unlinkTile() {
        this.linkedTile = null
    }

    linkTileForMerge(tile) {
        tile.setXY(this.x, this.y)
        this.linkedTileForMerge = tile
    }

    unlinkTileForMerge() {
        this.linkedTileForMerge = null
    }

    canAccept(newTile) {
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    }

    hasTileForMerge() {
        return !!this.linkedTileForMerge
    }

    mergeTiles(){
        this.linkedTile.setValue(this.linkedTile.value * 2)
        this.linkedTileForMerge.removeFromDOM()
        this.unlinkTileForMerge()
    }
}