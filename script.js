import { Grid } from "./grid.js"
import { Tile } from "./tile.js"


const gameBoard = document.querySelector("#game-board")
const grid = new Grid(gameBoard)

grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setupInputOnce() 
setupSwipeOnce()


function setupInputOnce() {
    window.addEventListener("keydown", handleInput, {once:true})
}
function setupSwipeOnce() {
    window.addEventListener("swiped", handleSwipe, {once:true})
}

async function handleInput(e) {
    switch(e.key) {
        case "ArrowUp":
            await moveUp()
            break
        case "ArrowDown":
            await moveDown()
            break
        case "ArrowLeft":
            await moveLeft()
            break
        case "ArrowRight":
            await moveRight()
            break
        default:
            setupInputOnce()
            return
    }

    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)

    if(!grid.getRandomEmptyCell()) {
        await newTile.waitForAnimationEnd()
        alert("try again!")
    }

    setupInputOnce()
}

async function handleSwipe(e) {
    switch(e.detail.dir) {
        case "up":
            await moveUp()
            break
        case "down":
            await moveDown()
            break
        case "left":
            await moveLeft()
            break
        case "right":
            await moveRight()
            break
        default:
            setupSwipeOnce()
            return
    }

    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)

    if(!grid.getRandomEmptyCell()) {
        await newTile.waitForAnimationEnd()
        alert("try again!")
    }

    setupSwipeOnce()
}

async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn)
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByColumnReversed)
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByRowReversed)
}

async function slideTiles(groupedCells) {
    const promises = []

    groupedCells.forEach(group => slideTilesInGroup(group, promises))

    await Promise.all(promises)

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    })
}

function slideTilesInGroup(group, promises) {
    for (let i=1; i<group.length; i++) {
        if (group[i].isEmpty()) {
            continue
        }

        const cellWithTile = group[i]

        let targetCell
        let j = i - 1

        while(j>=0 && group[j].canAccept(cellWithTile.linkedTile)){
            targetCell = group[j]
            j--
        }

        if(!targetCell){
            continue
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile)
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }

        cellWithTile.unlinkTile()
    }
}
