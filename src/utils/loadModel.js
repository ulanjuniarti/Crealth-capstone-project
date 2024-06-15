const tf = require('@tensorflow/tfjs-node');
const path = require('path');

let model;

const loadModel = async () => {
    try {
        console.log("Loading model...");
        const modelPath = `file://${path.join(__dirname, '../model/model.json')}`;
        console.log("Model path:", modelPath);
        model = await tf.loadLayersModel(modelPath);
        console.log("Model loaded successfully.");

        // Periksa apakah model memiliki lapisan input yang benar
        if (!model.inputs || model.inputs.length === 0) {
            throw new Error('Model does not have a valid input layer');
        }

        // Tambahkan logging untuk memeriksa struktur model
        console.log("Model summary:");
        model.summary();

        return model;
    } catch (error) {
        console.error("Failed to load model:", error);
        console.error("Error details:", error.stack);
        throw error;
    }
};

module.exports = { loadModel, getModel: () => model };
