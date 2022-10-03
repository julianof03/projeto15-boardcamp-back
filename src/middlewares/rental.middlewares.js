import connection from "../database.js";


async function validateRental(req, res, next){
    const { customerId } = req.body;

    const validCustomer = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if(validCustomer.rows.length === 0){
        return res.status(400).send({ message: "Usuário inexistente ou não encontrado" })
    }
    next();
}

export default validateRental;