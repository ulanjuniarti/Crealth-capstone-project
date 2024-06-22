import tf from '@tensorflow/tfjs-node';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '../prismaClient.js';

const loadJSON = async (relativePath) => {
  const absolutePath = path.resolve(relativePath);
  const data = await fs.readFile(absolutePath);
  return JSON.parse(data);
};

const encodeSymptoms = (symptoms, featureMapping) => {
  const encoded = Array(131).fill(0); // Ensure this length matches the training data
  symptoms.forEach(symptom => {
    if (featureMapping[symptom] !== undefined) {
      encoded[featureMapping[symptom]] = 1;
    }
  });
  return encoded;
};

const predictDisease = async (req, res) => {
  try {
    const symptoms = req.body.symptoms;
    console.log('Symptoms received:', symptoms);

    // Load data dynamically from the models folder
    const diseaseMapping = await loadJSON('src/models/diseaseMapping.json');
    const descriptions = await loadJSON('src/models/descriptions.json');
    const precautions = await loadJSON('src/models/precautions.json');
    const featureMapping = await loadJSON('src/models/featureMapping.json');

    const encodedSymptoms = encodeSymptoms(symptoms, featureMapping);
    console.log('Encoded symptoms:', encodedSymptoms);

    const inputTensor = tf.tensor2d([encodedSymptoms], [1, 131]); // Ensure shape matches training data

    // Ensure absolute path to model.json
    const modelPath = path.resolve('src/models/model.json');
    const model = await tf.loadGraphModel(`file://${modelPath}`);
    const predictions = model.predict(inputTensor);
    const predictionArray = await predictions.array();
    console.log('Predictions:', predictions);
    console.log('Prediction array:', predictionArray);

    const predictedClassIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
    console.log('Predicted class index:', predictedClassIndex);

    // Check diseaseMapping for the predicted disease
    const predictedDisease = Object.keys(diseaseMapping).find(key => diseaseMapping[key] === predictedClassIndex);

    if (!predictedDisease) {
      return res.status(404).json({ error: 'Disease not found' });
    }

    const description = descriptions[predictedDisease] ? descriptions[predictedDisease].description : 'Description not found';
    const precautionsList = precautions[predictedDisease] ? precautions[predictedDisease].precautions : ['Precautions not found'];

    const predictionData = {
      symptoms: symptoms.join(', '),
      disease: predictedDisease,
      description,
      precautions: Array.isArray(precautionsList) ? precautionsList.join(', ') : 'Precautions not found'    };

    // Save prediction to the database
    await prisma.prediction.create({
      data: predictionData
    });

    res.json(predictionData);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to predict disease' });
  }
};

export default predictDisease;
