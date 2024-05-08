import InputManger from "./inputManger.js";
import Player from "./player.js";
import RoomManger from "./roomManager.js";

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; //make pixelart


export default class Main {
    constructor() {
        this.roomManager = new RoomManger(ctx)
        this.player = new Player(ctx)
        this.inputManger = new InputManger(this.player)
        this.tick = this.tick.bind(this);
        this.lastTimestamp = 0
    }

    start() {


        //this.roomManager.update()

        requestAnimationFrame(this.tick)
    }
    tick(timestamp) {
        

        const deltaTime = (timestamp - this.lastTimestamp) / 1000
        this.lastTimestamp = timestamp

        //clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        //simulate
        this.player.update(deltaTime)
        this.roomManager.update()



        //draw - remember it needs to draw from back to front
        this.roomManager.drawRoom()
        this.player.drawPlayer()

        requestAnimationFrame(this.tick)
    }

}
const main = new Main();
main.start();
