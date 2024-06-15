const express = require('express');
const bodyParser = require('body-parser');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const { loadModel } = require('./utils/loadModel');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT || 5000;

app.use(bodyParser.json());
app.use('/api', diagnosisRoutes);

loadModel().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to load the model', err);
});
