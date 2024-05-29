export default class RoomManger {
    constructor(ctx) {
        this.ctx = ctx
        this.currentRoomArray = [
            4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4,
            3, 1, 11, 0, 0, 0, 11, 1, 11, 1, 0, 0, 11, 0, 3,
            3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 9, 0, 2, 1, 3,
            3, 0, 10, 9, 0, 0, 19, 12, 18, 0, 0, 9, 0, 0, 3,
            8, 1, 0, 11, 9, 2, 16, 13, 17, 0, 2, 11, 0, 0, 7,
            3, 2, 0, 10, 0, 0, 0, 0, 1, 0, 0, 9, 0, 0, 3,
            3, 9, 2, 1, 0, 0, 0, 2, 11, 2, 0, 0, 0, 0, 3,
            3, 0, 9, 0, 1, 0, 0, 0, 11, 11, 1, 0, 0, 11, 3,
            4, 4, 4, 4, 4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4
        ];
        this.tileW = 16
        this.tileH = 16
        this.gridRows = 9
        this.gridCols = 15
        this.tileMapImages = this.loadTilesFromDOM()
        this.roomImage = new Image() //burde bruge et room objekt
        this.start()
    }

    start() {
        //this.loadTilesFromDOM()

        this.roomImage.src = document.getElementById("wholeNewRoom").src //set room img src
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
