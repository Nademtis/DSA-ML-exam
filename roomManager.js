

export default class RoomManger {
    constructor(ctx) {
        this.ctx = ctx
        this.currentMapArray = [
            1, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            6, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 5,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 1
        ]
        this.tileW = 16
        this.tileH = 16
        this.gridRows = 9
        this.gridCols = 15
        this.tileMapImages = this.loadTilesFromDOM()
        this.roomImage = new Image()
        this.start()
    }

    start() {
        //this.loadTilesFromDOM()

        this.roomImage.src = document.getElementById("wholeRoom").src //set room img src
    }

    update(deltaTime) { //update should run every tick

        //logic for doors
    }

    drawRoom() {
        this.ctx.drawImage(this.roomImage, 0, 0)
    }

    /*drawRoomOld() { //for 1d array
        for (let r = 0; r < this.gridRows; r++) {
            for (let c = 0; c < this.gridCols; c++) {
                let arrayIndex = r * this.gridCols + c

                let tileImage = new Image()

                let tileValue = this.currentMapArray[arrayIndex]

                tileImage.src = this.tileMapImages[tileValue]
                this.ctx.drawImage(tileImage, this.tileW * c, this.tileH * r)
            }

        }
    }*/

    //this is used for getting single tiles in the program
    loadTilesFromDOM() {
        let tileMap = [];

        // Iterate over the tile IDs and push their corresponding image sources into the tileMap array
        for (let i = 0; i <= 8; i++) {
            let tileImage = document.getElementById(`tileImage${i}`);
            if (tileImage) {
                tileMap.push(tileImage.src);
            } else {
                console.error(`Tile image with ID tileImage${i} not found.`);
            }
        }
        return tileMap;
    }
}
