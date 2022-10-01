import express from 'express';
import connection from './database/database.js';

const app = express();
app.use(express.json());

app.get('/categories', async (req, res) => {
  console.log(connection);
  try{
      const games = await connection.query('SELECT * FROM rentals;');
      console.log(games);
      res.send(games.rows);
  }catch{
    res.sendStatus(400)
  }
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000.');
});