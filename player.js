export default class Player {
    constructor(ctx, roomManager) {
        this.ctx = ctx
        //player fields
        this.x = 15
        this.y = 10
        this.width = 16
        this.height = 20

        //player collision
        this.hitboxX = 4
        this.hitboxY = 15
        this.hitboxW = 8
        this.hitboxH = 5

        //for animation
        //this.playerFramesSouth = []
        //this.currentPlayerFrame = 0

        //idle player
        this.playerIdleImage

        //movement
        this.controls = { left: false, right: false, up: false, down: false }
        this.direction = ""
        this.isMoving = false
        this.moveSpeed = 65

        //shooting
        this.shootDirection = null
        this.canShoot = true
        this.fireRate = 2
        this.bulletSpeed = 100
        this.bulletDamage = 1

        //refference to roomManger (need this for movement collision) - uses currentMapArray
        this.roomManager = roomManager

        this.start()
    }
    start() {
        this.loadPlayerImage()

    }
    update(deltaTime) {
        this.movePlayer(deltaTime)
        this.playerShoot(deltaTime)
        //console.log(`${this.x}, ${this.y}`); //for logging player pos
    }

    
    loadPlayerImage() {
        this.playerIdleImage = new Image()
        this.playerIdleImage.src = document.getElementById("idlePlayerImage").src

    }

    playerShoot(deltaTime){
        if (this.shootDirection && this.canShoot){
            console.log("shoot: " + this.shootDirection);
            
            
            //shoot cooldown method - uses this.firerate from above
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, 1000 / this.fireRate);

        }
    }

    //#region playerMovement
    movePlayer(deltaTime) {
        const newPos = {
            x: this.x,
            y: this.y,
        }

        if (this.controls.left) {
            this.isMoving = true
            this.direction = "left"
            newPos.x -= this.moveSpeed * deltaTime
        } else if (this.controls.right) {
            this.isMoving = true
            this.direction = "right"
            newPos.x += this.moveSpeed * deltaTime
        }

        if (this.controls.up) {
            this.isMoving = true
            this.direction = "up"
            newPos.y -= this.moveSpeed * deltaTime
        } else if (this.controls.down) {
            this.isMoving = true
            this.direction = "down"
            newPos.y += this.moveSpeed * deltaTime
        }
        if (this.playerCanMoveTo(newPos)) {
            this.x = newPos.x
            this.y = newPos.y
        }
    }

    playerCanMoveTo(newPos) {

        let coord = this.getCoordFromPos(newPos.x, newPos.y)

        let coords = this.getTilesUnderPlayer(newPos)
        //console.log(coords);

        for (let i = 0; i < coords.length; i++) {
            if (!this.canMoveTo(coords[i])) {
                return false
            }
        }
        return true

    }
    canMoveTo({ row, col }) {
        if (row < 0 || row >= 9 - 1 ||
            col < 0 || col >= 15 - 1) {
            return false
        }
        let mapTileIndex = row * 15 + col
        const tileType = this.roomManager.currentMapArray[mapTileIndex]
        switch (tileType) {
            case 0: return true;
            //case 1: return true;
            //case 3: return true
        }
    }
    getCoordFromPos({ x, y }) {
        const row = Math.floor(y / 16)
        const col = Math.floor(x / 16)
        const coord = { row, col }
        return coord
    }

    getTilesUnderPlayer(newPos = { x: this.x, y: this.y }) {
        const tileCoords = []
        const topLeft = {
            x: newPos.x + this.hitboxX,
            y: newPos.y + this.hitboxY
        }
        const topRight = { x: topLeft.x + this.hitboxW, y: topLeft.y }
        const bottomLeft = { x: topLeft.x, y: topLeft.y + this.hitboxH };
        const bottomRight = { x: topRight.x, y: bottomLeft.y };


        const topLeftCoords = this.getCoordFromPos(topLeft)
        const topRightCoords = this.getCoordFromPos(topRight)
        const bottomLeftCoords = this.getCoordFromPos(bottomLeft);
        const bottomRightCoords = this.getCoordFromPos(bottomRight);

        tileCoords.push(topLeftCoords)
        tileCoords.push(topRightCoords)
        tileCoords.push(bottomLeftCoords);
        tileCoords.push(bottomRightCoords);

        return tileCoords

    }
    //#endregion playerMovement


    /*loadPlayerFrames() {
        let spriteSheet = new Image();
        //spriteSheet.src = `Character 3.png`; // Path to your player sprite sheet
        spriteSheet.src = document.getElementById("playerSheet").src; // Path to your player sprite sheet


        let imageW = 16
        let imageH = 20
        spriteSheet.onload =  () => {
    
            for (let i = 0; i < 4; i++) {
                this.playerFramesSouth.push({
                    image: spriteSheet,
                    sx: i * imageW,
                    sy: 0, //i * imageH
                    sw: imageW,
                    sh: imageH
                })
    
            }
        }
        
    }*/
    drawPlayer() {
        //const frame = this.playerFramesSouth[this.currentPlayerFrame];
        //console.log(frame.image.src); // Log the image object
        // Log the coordinates and dimensions
        //console.log("sx:", frame.sx);
        //console.log("sy:", frame.sy);
        //console.log("sw:", frame.sw);
        //console.log("sh:", frame.sh);

        //this.ctx.drawImage(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, 10, 10, frame.sw, frame.sh)
        this.ctx.drawImage(this.playerIdleImage, this.x, this.y)

        //draw debug on top
        this.debugShowPlayerMovementHitbox()
        this.debugDrawRectAroundTiles()
    }

    //#region debug
    debugShowPlayerMovementHitbox() {
        // might need to use this .save - don't really know
        //this.ctx.save();

        this.ctx.strokeStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.rect(this.x + this.hitboxX, this.y + this.hitboxY, this.hitboxW, this.hitboxH);
        this.ctx.stroke();

        // might need to use this .restore - don't really know
        //this.ctx.restore();
    }
    debugDrawRectAroundTiles() {
        this.ctx.strokeStyle = 'blue';
        const tiles = this.getTilesUnderPlayer();

        for (const tile of tiles) {
            const x = tile.col * 16;
            const y = tile.row * 16;
            this.ctx.beginPath();
            this.ctx.rect(x, y, 16, 16);
            this.ctx.stroke();
        }

        //this.ctx.restore();
    }
    //#endregion debug
}



//for player animation
/*let playerFramesEast = [];
let playerFramesNorth = [];
let playerFramesSouth = []
let currentPlayerFrame = 0;*/

function makePlayer() {
    let playerImage = new Image()
    playerImage.src = `Character 3.png`
    //src should be changed here right?

    playerImage.onload = function () {
        // Draw the image at its original size (16x20 pixels) and scale it up
        ctx.drawImage(playerImage, 0, 0,); // Scale up by 5 times
    };
}




