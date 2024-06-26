import Enemy from "./Enemy.js";
import BulletManager from "./managerScripts/bulletManager.js";
import InputManger from "./managerScripts/inputManager.js";
import Player from "./player.js";
import RoomManager from "./managerScripts/roomManager.js";

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; //make rendermode pixelart

export default class Main {
    constructor() {
        this.bulletManager = new BulletManager(ctx)
        this.roomManager = new RoomManager(ctx)
        this.player = new Player(ctx, this.roomManager, this.bulletManager)
        this.enemy = new Enemy(ctx, this.roomManager, this.player, 2, 13)
        this.inputManger = new InputManger(this.player)
        this.tick = this.tick.bind(this);
        this.lastTimestamp = 0
    }
    start() {
        requestAnimationFrame(this.tick)
    }
    tick(timestamp) {
        const deltaTime = (timestamp - this.lastTimestamp) / 1000
        this.lastTimestamp = timestamp

        //clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //simulate
        this.player.update(deltaTime)
        this.roomManager.update(deltaTime)
        this.bulletManager.update(deltaTime)
        this.enemy.update(deltaTime)

        //draw - remember it needs to draw from back to front
        this.roomManager.draw()
        this.bulletManager.draw()
        this.player.draw()
        this.enemy.draw()

        requestAnimationFrame(this.tick)
    }

}
const main = new Main();
main.start();
