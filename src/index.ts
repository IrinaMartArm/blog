import express from 'express';
import { setupApp } from './setup-app';

const app = express();
setupApp(app);

app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
