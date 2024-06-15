const tf = require('@tensorflow/tfjs-node');
const { getModel } = require('./loadModel');
const { convertSymptomsToNumeric } = require('./convertSymptoms');

// Asumsikan bahwa deskripsi dan pencegahan dapat diakses dari model atau mapping lokal
const diseaseInfo = {
  "Gastroenteritis": {
    "description": "Gastroenteritis adalah peradangan pada saluran pencernaan, terutama lambung, dan usus besar dan kecil. Gastroenteritis akibat virus dan bakteri adalah infeksi usus yang berhubungan dengan gejala diare, kram perut, mual, dan muntah.",
    "prevention": ["berhenti makan makanan padat untuk sementara waktu", "cobalah minum sedikit demi sedikit air", "istirahat", "kemudahan kembali makan"]
  },
  // Tambahkan data penyakit lainnya di sini
};

const predictDisease = async (symptoms) => {
  const model = getModel();
  if (!model) {
    throw new Error('Model not loaded');
  }

  const numericSymptoms = convertSymptomsToNumeric(symptoms);
  const inputTensor = tf.tensor2d([numericSymptoms]);
  const prediction = model.predict(inputTensor);
  const predictionArray = prediction.arraySync();

  // Contoh logika untuk mendapatkan nama penyakit dari hasil prediksi model
  const diseaseName = "Gastroenteritis";
                      "Malaria"; // Gantilah dengan logika sesuai hasil prediksi model

  if (!diseaseInfo[diseaseName]) {
    throw new Error('Disease information not found');
  }

  const { description, prevention } = diseaseInfo[diseaseName];
  return { disease: diseaseName, description, prevention };
};

module.exports = { predictDisease };
