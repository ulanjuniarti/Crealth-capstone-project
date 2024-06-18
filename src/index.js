import express from 'express';
import bodyParser from 'body-parser';
import predictRoute from './routes/predict.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api', predictRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
