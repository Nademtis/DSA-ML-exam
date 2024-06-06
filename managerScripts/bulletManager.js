export default class BulletManager {
    constructor(ctx) {
        this.ctx = ctx
        this.playerBullets = [];
        this.enemyBullets = [];
    }

    start() {

    }
    update(deltaTime) {
        this.simulatePlayerBullets(deltaTime)
    }
    draw() {
        this.drawPlayerBullets()
    }
    drawPlayerBullets(){
        for (let i = 0; i < this.playerBullets.length; i++) {
            let bullet = this.playerBullets[i];
            this.ctx.fillStyle = "red"; // Set bullet color
            
            // Draw a simple rectangle for the bullet
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // You can customize the drawing logic based on your bullet graphics
        }
    }
    simulatePlayerBullets(deltaTime){
        for (let i = 0; i < this.playerBullets.length; i++) {
            let bullet = this.playerBullets[i];
            
            // move bullet based on velocity. might work
            bullet.x += bullet.velocityX * deltaTime;
            bullet.y += bullet.velocityY * deltaTime;
            
            // should probably have collision and out of bounds here
            
        }
    }
    createBullet(playerX, playerY, shootDirection, bulletSpeed, bulletDamage) {
        console.log("should create bullet");
        
        let velocityX = 0;
        let velocityY = 0;

        switch (shootDirection) {
            case "right":
                velocityX = bulletSpeed;
                break;
            case "left":
                velocityX = -bulletSpeed;
                break;
            case "up":
                velocityY = -bulletSpeed;
                break;
            case "down":
                velocityY = bulletSpeed;
                break;
        }

        let bullet = {
            x: playerX,
            y: playerY,
            width: 5,
            height: 5,
            velocityX: velocityX,
            velocityY: velocityY,
            damage: bulletDamage
        };

        this.playerBullets.push(bullet);
    }
}