import connection from "../database.js";
import moment from "moment";

moment.locale("pt-br");

async function GetRentals(req, res) {
    const { customerId, gameId } = req.query;

    console.log(gameId);
    console.log(customerId);
        let rentals;
        if (customerId) {
            console.log("vou tentar")
            try{
                rentals = await connection.query(
                    `SELECT rentals.*, 
                    JSON_BUILD_OBJECT(
                        'id', customers.id,
                        'name', customers.name
                    )
                    AS customer,
                    JSON_BUILD_OBJECT(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', categories.name
                    )
                    AS game
                    FROM rentals 
                    JOIN customers 
                        ON rentals."customerId" = customers.id 
                    JOIN games 
                        ON rentals."gameId" = games.id 
                    JOIN categories 
                        ON games."categoryId" = categories.id 
                    WHERE customers.id = $1
;`,
                [customerId]);
                return res.send(rentals.rows).status(201);
            }catch (error) {

                res.status(500).send({ message: error.message });
        
            }
           
        }
        if (gameId) {
            try{
                rentals = (await connection.query(
                    `SELECT rentals.*, 
                        JSON_BUILD_OBJECT(
                            'id', customers.id,
                            'name', customers.name
                        )
                        AS customer,
                        JSON_BUILD_OBJECT(
                            'id', games.id,
                            'name', games.name,
                            'categoryId', games."categoryId",
                            'categoryName', categories.name
                        )
                        AS game
                        FROM rentals 
                        JOIN customers 
                            ON rentals."customerId" = customers.id 
                        JOIN games 
                            ON rentals."gameId" = games.id 
                        JOIN categories 
                            ON games."categoryId" = categories.id 
                        WHERE games.id = $1
                    ;`,
                    [gameId])).rows;
                return res.send(rentals.rows).status(201)
            } catch (error) {

                res.status(500).send({ message: error.message });
        
            }
            
        }
        if (gameId === undefined && customerId === undefined) {
            console.log("vou entrar aq");
            try{
                rentals = (await connection.query(
                    `SELECT rentals.*, 
                    JSON_BUILD_OBJECT(
                        'id', customers.id,
                        'name', customers.name
                    )
                    AS customer,
                    JSON_BUILD_OBJECT(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', categories.name
                    )
                    AS game
                    FROM rentals 
                    JOIN customers 
                    ON rentals."customerId" = customers.id 
                    JOIN games 
                    ON rentals."gameId" = games.id 
                    JOIN categories 
                    ON games."categoryId" = categories.id 
;`));
                return res.send(rentals.rows).status(201);
            } catch (error) {
        }
            
        }
}

async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = moment().format('L');
    try {

        const gamePrice = await connection.query('SELECT "pricePerDay" FROM games WHERE id = $1', [gameId])
        const price = gamePrice.rows[0].pricePerDay;
        const originalPrice = price * daysRented;

        const result = await connection.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, null,  null);', [customerId, gameId, rentDate, daysRented, originalPrice]
        );
        const Stock = (await connection.query('SELECT "stockTotal" FROM games WHERE id = $1', [gameId])).rows[0].stockTotal;
        const newStock = Stock - 1;
        const updateStock = await connection.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2`, [
            newStock,
            gameId,
        ]);
        return res.sendStatus(201);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}
async function returnRentals(req, res) {


    const { id } = req.params;
    const dateNow = moment().format('L');
    try {
        const rental = (
            await connection.query(
                `SELECT rentals.*, games."pricePerDay"
                FROM rentals
                JOIN games 
                ON rentals."gameId" = games.id 
                WHERE rentals.id = $1`,
                [id]
            )
        ).rows[0];
        console.log('passou 01');
        if (rental === undefined) {
            return res.sendStatus(404);
        }
        console.log('passou 02');
        if (rental.returnDate !== null) {
            return res.sendStatus(500);
        }

        console.log('passou 03');

        const nowDate = moment().format('L');

        const rentDate = new Date(rental.rentDate);

        let diff = moment(nowDate, "DD/MM/YYYY HH:mm:ss").diff(moment(rentDate, "DD/MM/YYYY HH:mm:ss"));
        let dias = moment.duration(diff).asDays();

        const delayFee = dias * rental.pricePerDay;

        const endRental = await connection.query(
            'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
            [dateNow, delayFee, id]
        );

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }
}

async function DeleteRent(req, res) {

    const { id } = req.params;
    const rent = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);

    if (rent.rows.length === 0) {
        return res.status(404).send({ message: "Aluguel não encontrado" });
    }

    if (rent.rows[0].returnDate !== null) {
        return res.status(400).send({ message: "Este aluguel ja foi entregue" });
    }


    try {
        const deleteRental = await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

export { GetRentals, postRentals, returnRentals, DeleteRent }