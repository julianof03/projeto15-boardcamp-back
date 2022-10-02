import connection from '../database/database.js';

async function GetGames(req, res) {
    const { name } = req.query;
    try {
        const games = await connection.query(
            'SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id'
        );
        res.status(201).send(games.rows);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function AddGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const validCategory = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    const validGame = await connection.query('SELECT * FROM games WHERE name = $1', [name]);

    if (validGame.rows.length !== 0) {
        console.log("não achei games validos");
        res.status(400).send('Parece que esse jogo ja existe');
    }

    if (validCategory.rows.length === 0) {
        console.log(validCategory.rows.length);
        res.status(400).send('Categoria inválida ou inexistente');
    }
    try {
        const inserGames = await connection.query(
            'INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export { AddGames, GetGames };