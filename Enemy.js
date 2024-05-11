export default class Enemy {
    constructor(ctx, roomManager, player) {
        this.ctx = ctx;
        this.roomManager = roomManager;
        this.player = player

        //enemy Position
        this.x = 16 * 10
        this.y = 16 * 2
        this.width = 10
        this.height = 10

        //movement
        this.moveSpeed = 65

        //for Astar (pathfinding)
        this.openTiles = []    //nodes we currently look at
        this.closedTiles = []  //nodes we have allready looked at
        this.pathToPlayer = []

        //for debuggin line of sight (bresenhams)
        this.lineCellList = []

        this.start()
    }
    start() {

        //runs Astar every
        setInterval(() => {
            this.AstarRunner();
        }, 300);


    }
    update(deltaTime) {
        this.moveTowardsPlayer(deltaTime)
        //this.lineCellList = [] //empty LOS array
        //this.calculateLineOfSight(this.x + 5, this.y + 5, this.player.x + this.player.hitboxX, this.player.y + this.player.hitboxY)

    }
    draw() {
        this.drawEnemyCube()
        //this.debugDrawLineOfSight()
        //this.debugDrawPath()
    }
    moveTowardsPlayer(deltaTime) { //GOT FROM GPT - WILL MAKE OWN LATER 
        if (this.pathToPlayer.length === 0) {
            // No path to follow
            return;
        }

        // Get the next tile in the path
        const nextTile = this.pathToPlayer[0];

        // Calculate the destination position based on the next tile
        const destX = nextTile.col * 16; // Assuming each tile is 16 pixels wide
        const destY = nextTile.row * 16; // Assuming each tile is 16 pixels tall

        // Calculate the direction to move in
        const dx = destX - this.x +2;
        const dy = destY - this.y +2;

        // Calculate the distance to move in each frame based on move speed and deltaTime
        const distanceToMove = this.moveSpeed * deltaTime;

        // Calculate the magnitude of the direction vector
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        // Normalize the direction vector
        const nx = dx / magnitude;
        const ny = dy / magnitude;

        // Calculate the movement in x and y directions
        const moveX = nx * distanceToMove;
        const moveY = ny * distanceToMove;

        // If the enemy is close enough to the next tile, remove it from the path
        if (Math.abs(dx) <= distanceToMove && Math.abs(dy) <= distanceToMove) {
            this.pathToPlayer.shift(); // Remove the first element (next tile) from the path
            return;
        }

        // Update the position of the enemy
        this.x += moveX;
        this.y += moveY;
    }



    //should move towards player
    //should use this.movespeed
    // this.pathToPlayer is the path to player

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

            this.openTiles.sort((a, b) => a.fCost - b.fCost); //sort the openTiles by fCost - we allways want to look at the closest tile first
            let currentTile = this.openTiles.shift(); // return and remove from openTiles the possible bestTile
            this.closedTiles.push(currentTile)

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

                //check if neighbor is within closedList - we dont want to check it anymore, we allready did
                if (this.isTileInlist(this.openTiles, neighbor)) {
                    //console.log("already checked in openList, skipping this one");
                    continue
                }

                //check if neigbor is in closedList - meaning...
                if (this.isTileInlist(this.closedTiles, neighbor)) {
                    //console.log("this is in closedList, skipping this one");
                    continue
                } else {
                    this.openTiles.push(neighbor)
                }
            }

            this.closedTiles.push(currentTile)

            //make sure not infinite while loop (this is only for safety reasons)
            if (debugIndex > 995) {
                console.error("something went wrong in Astar")
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
            if (this.roomManager.currentMapArray[(row + 1) * 15 + col] == 0) //only add if walkable
                possibleNeighbors.push({ row: row + 1, col: col, d: "below" })
        }

        if (row - 1 >= 1) {//add above
            if (this.roomManager.currentMapArray[(row - 1) * 15 + col] == 0)
                possibleNeighbors.push({ row: row - 1, col: col, d: "above" })
        }

        if (col + 1 < 14) {//add right
            if (this.roomManager.currentMapArray[row * 15 + (col + 1)] == 0)
                possibleNeighbors.push({ row: row, col: col + 1, d: "right" })
        }
        if (col - 1 > 0) {//add left
            if (this.roomManager.currentMapArray[row * 15 + (col - 1)] == 0)
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

        //path.unshift(startTile); // add first start tile because we're done - might not need since enemy know what tile it's on
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