export default class InputManger {
    constructor(player) {
        this.player = player
        this.start()
    }
    start() {
        this.setupKeyboardListener()
    }

    setupKeyboardListener() {
        document.addEventListener("keydown", (event) => this.keyPress(event)) // without using arrow function the method would not have the correct refference
        document.addEventListener("keyup", (event) => this.keyUp(event))
    }
    keyPress(event) {
        switch (event.key) {
            case "d": this.player.controls.right = true; break
            case "a": this.player.controls.left = true; break
            case "w": this.player.controls.up = true; break
            case "s": this.player.controls.down = true; break
            //case "e": this.controls.use = true; break
            case "ArrowRight": this.player.shootDirection = "right"; break
            case "ArrowLeft": this.player.shootDirection = "left"; break
            case "ArrowUp": this.player.shootDirection = "up"; break
            case "ArrowDown": this.player.shootDirection = "down"; break
        }
        if (this.player.controls.right) this.player.direction = "right"
        else if (this.player.controls.left) this.player.direction = "left"
        else if (this.player.controls.up) this.player.direction = "up"
        else if (this.player.controls.down) this.player.direction = "down"
    }

    keyUp(event) {
        switch (event.key) {
            case "d": this.player.controls.right = false; break
            case "a": this.player.controls.left = false; break
            case "w": this.player.controls.up = false; break
            case "s": this.player.controls.down = false; break
            //case "e": this.controls.use = false; break
            case "ArrowRight":
            case "ArrowLeft":
            case "ArrowUp":
            case "ArrowDown":
                this.player.shootDirection = null; break
        }
    }
}