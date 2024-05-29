let model;
let tileImageList = []
let roomImage = document.getElementById("wholeNewRoom")

window.addEventListener("load", start)
function start() {
    initModel()
    initTileImageList()
    //trainModel(500)
}

async function initModel() {
    model = tf.sequential();

    model.add(tf.layers.conv2d({
        filters: 5, //was 5
        kernelSize: 3, //was 3
        activation: 'relu',
        inputShape: [16, 16, 3]
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
        units: 15, //was 10
        activation: 'relu'
    }));


    model.add(tf.layers.dense({
        units: 20,  //because we have 20 tiles
        activation: 'softmax'
    }));

    const adam = tf.train.adam(0.002); //was 0.001

    model.compile({
        optimizer: adam,
        loss: 'categoricalCrossentropy', // binaryCrossentropy for multi-label classification and Categorical cross-entropy for single-label classification
        metrics: ['accuracy']
    });
}
function initTileImageList() {
    const tileImages = document.querySelectorAll('[id^="tileImage"]');

    tileImages.forEach(img => {
        tileImageList.push(img);
    });
    //console.log(tileImageList.length);
}
async function trainModel(amountOfEpochs) {
    if (!amountOfEpochs)
        console.error("input amount of ecochs")

    const tensorImageList = []
    const labels = []

    for (let i = 0; i < tileImageList.length; i++) {
        const tensorImage = preprocessImage(tileImageList[i]); // Preprocess the image
        tensorImageList.push(tensorImage); // Add the preprocessed image to the list

        // Create corresponding label (one-hot encoded)
        const label = tf.oneHot(i, tileImageList.length);
        labels.push(label);
    }
    const inputImagesTensor = tf.stack(tensorImageList); // Stack the preprocessed images into a single tensor
    const labelsTensor = tf.stack(labels);

    // Fit the model
    const history = await model.fit(inputImagesTensor, labelsTensor, {
        epochs: amountOfEpochs,
        verbose: 1,
        shuffle: true, // Shuffle the dataset before each epoch
        batchSize: 1 // Adjust batch size as needed
    });

    console.log(history); // Print training history to console

}
function preprocessImage(image) {
    const tensorImage = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([16, 16]) // just in case image is not 16x16 pixels
        .toFloat()
        .div(tf.scalar(255)); // normalize/scale pixel values

    return tensorImage;
}
function predict(image) {
    const tensorImage = preprocessImage(image)
    const reshapedImage = tensorImage.reshape([1, 16, 16, 3]);
    const predictions = model.predict(reshapedImage);

    predictions.print();

    const predictionValues = predictions.arraySync()[0]; // convert tensor predictions to JS array
    const predictedIndex = predictionValues.indexOf(Math.max(...predictionValues)); // ... is javascript spread syntax, so it calcs the correct index

    //return tileImageList[predictedIndex].src //for checking predict is correct image
    return predictedIndex;
}
function generateRoomArray(roomImage) {
    const roomWidth = 15; // Room width in tiles
    const roomHeight = 9; // Room height in tiles
    const tileSize = 16; // Each tile is 16x16 pixels

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = roomImage.width;
    canvas.height = roomImage.height;
    context.drawImage(roomImage, 0, 0, roomImage.width, roomImage.height);

    const roomArray = [];

    for (let y = 0; y < roomHeight; y++) {
        for (let x = 0; x < roomWidth; x++) {
            const imageData = context.getImageData(x * tileSize, y * tileSize, tileSize, tileSize);
            const tileCanvas = document.createElement('canvas');
            const tileContext = tileCanvas.getContext('2d');
            tileCanvas.width = tileSize;
            tileCanvas.height = tileSize;
            tileContext.putImageData(imageData, 0, 0);

            /*const tensorImage = preprocessImage(tileCanvas);
            const reshapedImage = tensorImage.reshape([1, 16, 16, 3]);
            const predictions = model.predict(reshapedImage);

            const predictionValues = predictions.arraySync()[0]; // convert tensor predictions to JS array
            const predictedIndex = predictionValues.indexOf(Math.max(...predictionValues)); // Get the index of the highest prediction value
            */
            let predictedIndex = predict(tileCanvas)
            roomArray.push(predictedIndex);
        }
    }

    //console.log(roomArray); // for printingthe array not formatted
    //this.currentMapArray = roomArray;
    let formattedArray = printFormattedArray(roomArray)
}
function printFormattedArray(array) { //this formatting method is from chatGPT
    const rows = 9;
    const cols = 15;
    let formattedString = 'this.currentMapArray = [\n';

    for (let i = 0; i < rows; i++) {
        formattedString += '    ';
        for (let j = 0; j < cols; j++) {
            formattedString += array[i * cols + j];
            if (j < cols - 1) {
                formattedString += ', ';
            }
        }
        if (i < rows - 1) {
            formattedString += ',\n';
        }
    }
    formattedString += '\n];';
    console.log(formattedString);
}
async function trainModelUntilPerfect() {
    let allPredictionsCorrect = false;
    let totalEpochsNeeded = 0

    while (!allPredictionsCorrect) {
        await trainModel(10);
        totalEpochsNeeded += 10;
        allPredictionsCorrect = true;

        for (let i = 0; i < tileImageList.length; i++) {
            let predictedIndex = predict(tileImageList[i]);

            if (predictedIndex !== i) {
                allPredictionsCorrect = false;
                break;
            }
        }

        if (allPredictionsCorrect) {
            console.log(`Model is trained to perfection. It needed ${totalEpochsNeeded} epochs`);
        } else {
            console.log("Model needs more training...");
        }
    }
}
