let model;
let imageList = []
let labels = []

function initModel() {
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
        units: 10,
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: 6,
        activation: 'softmax'
    }));

    const adam = tf.train.adam(0.01);

    model.compile({
        optimizer: adam,
        loss: 'categoricalCrossentropy', // binaryCrossentropy for multi-label classification and Categorical cross-entropy for single-label classification
        metrics: ['accuracy']
    });
}
function initImageListAndLabels() {

}