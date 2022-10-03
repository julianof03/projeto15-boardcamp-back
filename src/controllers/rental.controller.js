import connection from "../database.js";


async function GetRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        let rentals;
        if (customerId) {
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
                ;`
            [customerId]);
            res.send(rentals);
        }
        if (gameId) {
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
            res.send(rentals);
        }
        if (!gameId && !customerId) {
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
                ;`)).rows;
                res.send(rentals);
        }       

    } catch (error) {

        res.status(500).send({ message: error.message });

    }
}

export { GetRentals }