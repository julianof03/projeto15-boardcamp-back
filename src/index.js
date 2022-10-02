import express from 'express';
import connection from './database/database.js';

import gameRouter from './routers/games.Routers.js'

const app = express();
app.use(express.json());


app.use(gameRouter);

app.listen(4000, () => {
  console.log('Server is listening on port 4000.');
});