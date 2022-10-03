import express from 'express';
import cors from "cors";
import connection from './database.js';

import gameRouter from './routers/games.Routers.js';
import categorieRouter from './routers/categories.Routers.js';
import customerRouter from './routers/customers.Routers.js';
import RentalsRouter from './routers/rental.Routers.js'; 

const app = express();
app.use(cors());
app.use(express.json());


app.use(gameRouter);
app.use(categorieRouter);
app.use(customerRouter);
app.use(RentalsRouter);

app.listen(4000, () => {
  console.log('Server is listening on port 4000.');
});