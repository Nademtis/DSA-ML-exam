export default class Enemy {
    constructor(ctx, roomManager, player) {
        this.ctx = ctx;
        this.roomManager = roomManager;
        this.player = player
        // Other enemy properties initialization

        //enemy Position
        this.x = 120
        this.y = 50

        this.width = 10
        this.height = 10

        //for Astar
        this.openTiles = []    //nodes we currently look at
        this.closedTiles = []            //nodes we have allready looked at

        //for debug
        this.lineCellList = []

        this.start()
    }
    start() {
        this.aStar(this.x, this.y, this.player.x + this.player.hitboxX, this.player.y + this.player.hitboxY)

    }
    update() {
        //this.lineCellList = [] //emply LOS array
        //this.calculateLineOfSight(this.x + 5, this.y + 5, this.player.x + this.player.hitboxX, this.player.y + this.player.hitboxY)

    }
    draw() {
        this.drawEnemyCube()
        //this.debugDrawLineOfSight()
        this.debugDrawPath()
    }
    aStar(startX, startY, endX, endY) {
        let startCoord = this.getCoordFromPos({ x: startX, y: startY })
        let endCoord = this.getCoordFromPos({ x: endX, y: endY })

        //fCost = g + h
        //gCost = from startCoord to given tile
        //hCost = heuristic - estimated cost for this tile to endCoord - use manhatten
        startCoord.gCost = 0
        startCoord.hCost = this.calcManhattenDistance(startCoord.row, startCoord.col, endCoord.row, endCoord.col)
        startCoord.fCost = startCoord.gCost + startCoord.hCost
        this.openTiles.push(startCoord)

        //while(this.openTiles.length > 0){}
        let neighbors = this.getNeighborTiles(startCoord.row, startCoord.col)
        console.log(neighbors);

        console.log(startCoord);
        //let manhattenDistance = Math.abs((startCoord.row - endCoord.row)) + Math.abs((startCoord.col - endCoord.col))

    }
    calcManhattenDistance(startRow, startCol, endRow, endCol) {
        return Math.abs(startRow - endRow) + Math.abs(startCol - endCol)
    }
    getNeighborTiles(row, col) {
        let possibleNeighbors = []


        if (row + 1 < 8) {//add below
            possibleNeighbors.push({ row: row + 1, col: col })
        }

        if (row - 1 > 1) {//add above
            possibleNeighbors.push({ row: row - 1, col: col })
        }

        if (col + 1 < 14) {//add right
            possibleNeighbors.push({ row: row, col: col + 1 })
        }
        if (col - 1 > 0) {//add left
            possibleNeighbors.push({ row: row, col: col - 1 })
        }

        return possibleNeighbors
    }

    drawEnemyCube() {
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();
    }
    debugDrawPath() {
        for (let i = 0; i < this.openTiles.length; i++) {
            const x = this.openTiles[i].col * 16;
            const y = this.openTiles[i].row * 16;

            this.ctx.strokeStyle = "orange";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.rect(x, y, 16, 16);
            this.ctx.stroke();
        }
    }

    calculateLineOfSight(startX, startY, endX, endY) {
        //console.log(`${startX}, ${startY}, ${endX}, ${endY}`);
        let coord1 = this.getCoordFromPos({ x: startX, y: startY })
        let coord2 = this.getCoordFromPos({ x: endX, y: endY })
        //console.log(`${coord1.row}-${coord1.col}, ${coord2.row}-${coord2.col} `); // print the following right now: 0-0, 3-8

        //let m = (endY - startY) / (endX - startX) //print the following right now: 0.36

        let dx = Math.abs(coord2.col - coord1.col);
        let dy = Math.abs(coord2.row - coord1.row);
        let sx = (coord1.col < coord2.col) ? 1 : -1;
        let sy = (coord1.row < coord2.row) ? 1 : -1;
        let err = dx - dy; //bresenhams error. used for determining if y should change

        let currentCol = coord1.col;
        let currentRow = coord1.row;

        while (currentCol !== coord2.col || currentRow !== coord2.row) {

            //console.log(`Cell: ${currentRow}-${currentCol}`);
            this.lineCellList.push({ row: currentRow, col: currentCol })

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                currentCol += sx;
            }
            if (e2 < dx) {
                err += dx;
                currentRow += sy;
            }
        }
        //for pushing the tile player is on - is only really used in the debugdraw
        if (currentCol == coord2.col || currentRow == coord2.row) {
            this.lineCellList.push({ row: currentRow, col: currentCol })
        }
    }
    debugDrawLineOfSight() {

        for (let i = 0; i < this.lineCellList.length; i++) {
            const x = this.lineCellList[i].col * 16;
            const y = this.lineCellList[i].row * 16;

            //only blue if floor
            if (this.roomManager.currentMapArray[this.lineCellList[i].row * 15 + this.lineCellList[i].col] == 0) {
                this.ctx.strokeStyle = 'blue';
            } else {
                this.ctx.strokeStyle = 'red';
            }

            // Draw a rectangle around the tile
            //this.ctx.strokeStyle = 'blue'; // Change color as needed
            this.ctx.lineWidth = 1; // Adjust line width as needed
            this.ctx.beginPath();
            this.ctx.rect(x, y, 16, 16);
            this.ctx.stroke();
        }

    }
    getCoordFromPos({ x, y }) {
        const row = Math.floor(y / 16)
        const col = Math.floor(x / 16)
        const coord = { row, col }
        return coord
    }
}