let model;
let tileImageList = []
let labels = []

window.addEventListener("load",start)
function start(){
    initModel()
    initTileImageList()
    //trainModel()
}

async function initModel() {
    model = tf.sequential();

    model.add(tf.layers.conv2d({
        filters: 5,
        kernelSize: 3,
        activation: 'relu',
        inputShape: [16, 16, 3]
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
        units: 15,
        activation: 'relu'
    }));
    

    model.add(tf.layers.dense({
        units: 20,  //because we have 20 tiles
        activation: 'softmax'
    }));

    const adam = tf.train.adam(0.001);

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
async function trainModel(){
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
        epochs: 100,
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
        .div(tf.scalar(255)); // normalize pixel values to [0, 1]

    return tensorImage;
}
function predict(image){
    const tensorImage = preprocessImage(image)

    const reshapedImage = tensorImage.reshape([1, 16, 16, 3]);
    const predictions = model.predict(reshapedImage);

    predictions.print();

}