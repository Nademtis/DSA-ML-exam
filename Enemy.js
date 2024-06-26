export default class Enemy {
    constructor(ctx, roomManager, player, spawnRow, spawnCol) {
        this.ctx = ctx;
        this.roomManager = roomManager;
        this.player = player

        //enemy Position
        this.x = 16 * spawnCol + 3 //+3 is just to center enemy - delete later
        this.y = 16 * spawnRow + 3 //+3 is just to center enemy - delete later
        this.width = 10
        this.height = 10

        //movement
        this.moveSpeed = 25

        //for Astar (pathfinding)
        this.openTiles = []    //nodes we need to look at
        this.closedTiles = []  //nodes we have allready looked at
        this.pathToPlayer = []

        //for debuggin line of sight (bresenhams)
        this.lineCellList = []

        //debug flag - used for gui buttons
        this.debugLineOfSight = false;
        this.debugPath = false;

        this.start()
    }
    start() {
        //runs Astar every 0.1 seconds (no reason for every frame)
        setInterval(() => {
            this.AstarRunner();
        }, 100);

        //for the GUI button to turn on and off
        document.getElementById('toggleLineOfSight').addEventListener('click', () => {
            this.debugLineOfSight = !this.debugLineOfSight;
        });

        //for the GUI button to turn on and off
        document.getElementById('togglePath').addEventListener('click', () => {
            this.debugPath = !this.debugPath;
        });
    }
    update(deltaTime) {
        this.moveTowardsPlayer(deltaTime)

        this.calculateLineOfSight(this.x, this.y, this.player.x + this.player.hitboxX, this.player.y + this.player.hitboxY)

        this.updateButtonStyles() //for the debug draw buttons in gui
    }
    draw() {
        this.drawEnemyCube()

        //DEBUG
        if (this.debugLineOfSight) this.debugDrawLineOfSight();
        if (this.debugPath) this.debugDrawPath();
    }
    updateButtonStyles() { //this method is for the GUI buttons
        const lineOfSightButton = document.getElementById('toggleLineOfSight');
        const pathButton = document.getElementById('togglePath');

        lineOfSightButton.classList.toggle('active', this.debugLineOfSight);
        pathButton.classList.toggle('active', this.debugPath);
    }
    moveTowardsPlayer(deltaTime) {
        if (this.pathToPlayer.length === 0) return // enemy might be next to player or there is no path

        const nextTile = this.pathToPlayer[0];

        const destX = nextTile.col * 16; //calc in pixels the next x
        const destY = nextTile.row * 16; //calc in pixels the next y

        const dx = destX - this.x + 3; //calculate direction to move in
        const dy = destY - this.y + 3;

        const distanceToMove = this.moveSpeed * deltaTime; //calc how far enemy should move based on speed and deltaTime

        const magnitude = Math.sqrt(dx * dx + dy * dy); //calc vector magnitude in order to normalize

        const nx = dx / magnitude; //calc normalized x
        const ny = dy / magnitude; //calc normalized y

        const moveX = nx * distanceToMove; //use normalized values with distanceToMove (enemy should not move faster diagonally)
        const moveY = ny * distanceToMove;

        this.x += moveX;
        this.y += moveY;
    }

    AstarRunner() {
        this.aStar(this.x, this.y, this.player.x + this.player.hitboxX, this.player.y + this.player.hitboxY)
        this.openTiles = []
        this.closedTiles = []
    }
    aStar(startX, startY, endX, endY) {
        let startCoord = this.getCoordFromPos({ x: startX, y: startY })
        let endCoord = this.getCoordFromPos({ x: endX, y: endY })
        //console.log(`startCoord: ${startCoord.row}, ${startCoord.col}`);
        //console.log(`endCoord: ${endCoord.row}, ${endCoord.col}`);

        //gCost = from startCoord to given tile
        //hCost = heuristic - estimated cost from this tile to endCoord - I use manhatten distance
        //fCost = g + h - the totalValue
        startCoord.gCost = 0
        startCoord.hCost = this.calcManhattenDistance(startCoord.row, startCoord.col, endCoord.row, endCoord.col)
        startCoord.fCost = startCoord.gCost + startCoord.hCost
        this.openTiles.push(startCoord)

        let debugIndex = 0
        let endFound = false
        while (this.openTiles.length > 0 || debugIndex > 1000) { //while openTiles is not empty (there is more to check)
            if (endFound) break;

            this.openTiles.sort((a, b) => a.fCost - b.fCost); //sort the openTiles by fCost - we allways want to look at the best tile first
            let currentTile = this.openTiles.shift(); // return and remove from openTiles the possible bestTile

            let neighbors = this.getNeighborTiles(currentTile.row, currentTile.col)
            //console.log(neighbors);

            //now look at the neighbors one at a time
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i]
                neighbor.parent = currentTile

                //check if goal
                if (neighbor.row == endCoord.row && neighbor.col == endCoord.col) {
                    //console.log("found end");
                    endFound = true
                }

                //give values to neighbor
                neighbor.gCost = currentTile.gCost + 1 //distance from parent to this tile
                neighbor.hCost = this.calcManhattenDistance(neighbor.row, neighbor.col, endCoord.row, endCoord.col)
                neighbor.fCost = neighbor.gCost + neighbor.hCost

                //check if neighbor is within openTiles - we dont want to check it anymore, we allready did
                if (this.isTileInlist(this.openTiles, neighbor)) {
                    //console.log("already checked in openList, skipping this one");
                    continue
                }

                //check if neigbor is in closedList
                if (this.isTileInlist(this.closedTiles, neighbor)) {
                    //console.log("this is in closedList, skipping this one");
                    continue
                } else {
                    this.openTiles.push(neighbor)
                }
            }
            this.closedTiles.push(currentTile)

            //make sure not infinite while loop (this is only for safety reasons if enemy is somehow out of the grid)
            if (debugIndex > 995) {
                console.error("something went wrong in Astar in this object:" + this)
                //should kill/remove this object
            }
            debugIndex++
        }
        // After finding the end tile
        if (endFound) {
            let lastIndex = this.closedTiles.length - 1
            this.backTrack(startCoord, this.closedTiles[lastIndex]);
            //console.log("Path:", path); // Display the path in the console or store it for later use
        }
    }
    isTileInlist(list, tile) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].row == tile.row && list[i].col == tile.col && list[i].fCost < tile.fCost) {
                return true
            }
        }
        return false
    }
    calcManhattenDistance(startRow, startCol, endRow, endCol) {
        return Math.abs(startRow - endRow) + Math.abs(startCol - endCol)
    }
    getNeighborTiles(row, col) {
        let possibleNeighbors = []

        if (row + 1 < 8) {//add below
            if (this.roomManager.currentRoomArray[(row + 1) * 15 + col] <= 2) //only add if walkable - check DOM for tileImage indexes
                possibleNeighbors.push({ row: row + 1, col: col, d: "below" })
        }

        if (row - 1 >= 1) {//add above
            if (this.roomManager.currentRoomArray[(row - 1) * 15 + col] <= 2)
                possibleNeighbors.push({ row: row - 1, col: col, d: "above" })
        }

        if (col + 1 < 14) {//add right
            if (this.roomManager.currentRoomArray[row * 15 + (col + 1)] <= 2)
                possibleNeighbors.push({ row: row, col: col + 1, d: "right" })
        }
        if (col - 1 > 0) {//add left
            if (this.roomManager.currentRoomArray[row * 15 + (col - 1)] <= 2)
                possibleNeighbors.push({ row: row, col: col - 1, d: "left" })
        }
        return possibleNeighbors
    }
    backTrack(startTile, endTile) {
        //console.log(`startCoord: ${startTile.row}, ${startTile.col}`);
        //console.log(`endCoord: ${endTile.row}, ${endTile.col}`);
        let path = [];
        let currentTile = endTile;

        // backtrack from end to start - we use parent 
        while (currentTile !== startTile) {
            path.unshift(currentTile); // add the current tile in front of the path array
            currentTile = currentTile.parent;
        }
        this.pathToPlayer = path //finalPath is used for drawing and possible movement
    }
    drawEnemyCube() {
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();
    }
    debugDrawPath() {
        for (let i = 0; i < this.pathToPlayer.length; i++) {
            const x = this.pathToPlayer[i].col * 16;
            const y = this.pathToPlayer[i].row * 16;

            this.ctx.strokeStyle = "orange";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.rect(x, y, 16, 16);
            this.ctx.stroke();
        }
    }
    calculateLineOfSight(startX, startY, endX, endY) {
        this.lineCellList = [] //empty the array from previous frame/tick
        //console.log(`${startX}, ${startY}, ${endX}, ${endY}`);
        let coord1 = this.getCoordFromPos({ x: startX, y: startY })
        let coord2 = this.getCoordFromPos({ x: endX, y: endY })
        //console.log(`${coord1.row}-${coord1.col}, ${coord2.row}-${coord2.col} `); // print the following right now: 0-0, 3-8

        //let m = (endY - startY) / (endX - startX) //print the following right now: 0.36

        let dx = Math.abs(coord2.col - coord1.col);     //the absoulute difference between start and end point
        let dy = Math.abs(coord2.row - coord1.row);     //the absoulute difference between start and end point
        let sx = (coord1.col < coord2.col) ? 1 : -1;    //determine the direction 
        let sy = (coord1.row < coord2.row) ? 1 : -1;    //determine the direction
        let err = dx - dy;                              //bresenhams error. used for determining if y or x should change

        let currentCol = coord1.col;
        let currentRow = coord1.row;

        while (currentCol !== coord2.col || currentRow !== coord2.row) {

            //console.log(`Cell: ${currentRow}-${currentCol}`);
            this.lineCellList.push({ row: currentRow, col: currentCol })

            let e2 = 2 * err; //double the err to remove floating point numbers (computer is faster with int)
            if (e2 > -dy) {
                err -= dy;
                currentCol += sx;
            }
            if (e2 < dx) {
                err += dx;
                currentRow += sy;
            }
        }
        //for pushing the tile player is on - is only really used in the debugdraw LOS
        if (currentCol == coord2.col || currentRow == coord2.row) {
            this.lineCellList.push({ row: currentRow, col: currentCol })
        }
    }
    debugDrawLineOfSight() {
        for (let i = 0; i < this.lineCellList.length; i++) {
            const x = this.lineCellList[i].col * 16;
            const y = this.lineCellList[i].row * 16;

            //only blue if floor
            if (this.roomManager.currentRoomArray[this.lineCellList[i].row * 15 + this.lineCellList[i].col] <= 2) { //check DOM tiles for this <=2
                this.ctx.strokeStyle = 'blue';
            } else {
                this.ctx.strokeStyle = 'red';
            }

            // Draw a rectangle around the tile
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