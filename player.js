export default class Player {
    constructor(ctx) {
        this.ctx = ctx
        //player fields
        this.x = 5
        this.y = 5
        this.width = 16
        this.height = 20

        //for animation
        this.playerFramesSouth = []
        this.currentPlayerFrame = 0

        //idle player
        this.playerIdleImage

        //movement
        this.controls = { left: false, right: false, up: false, down: false }
        this.direction = ""
        this.isMoving = false
        this.moveSpeed = 65

        this.start()
    }
    start() {
        this.loadPlayerImage()

    }
    update(deltaTime) {
        this.movePlayer(deltaTime)
        //console.log(`playerX: ${this.x}, playerY: ${this.y}`); // for logging x and y
    }
    loadPlayerImage() {
        this.playerIdleImage = new Image()
        this.playerIdleImage.src = document.getElementById("idlePlayerImage").src

    }
    movePlayer(deltaTime){
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

        //should use a canMoveToPos method
            this.x = newPos.x
            this.y = newPos.y

        /*if (this.canMovePlayerToPos(newPos)) {
            this.model.player.x = newPos.x
            this.model.player.y = newPos.y
        }*/
    }




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
    }


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




