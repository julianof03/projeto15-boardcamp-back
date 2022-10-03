import connection from "../database.js";


async function GetCustomers(req, res) {
    const  cpf  = req.query.cpf;
    console.log(cpf)
    try {
        if (cpf) {
            console.log("entrei aq")
            const customers = await connection.query(
                `SELECT * FROM customers WHERE cpf LIKE "${cpf}%"`
              );
            return res.status(201).send(customers.rows);
        }
        console.log("passei direto")
        const customers = await connection.query(
            'SELECT * FROM customers'
        );
        return res.status(201).send(customers.rows);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function CreateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const validCpf = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);

    if (validCpf.rows.length !== 0) {
        return res.status(409).send('Parece que esse cpf ja foi cadastrado');
    }

    try {
        const customers = await connection.query(
            'INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4)',
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function SelectCustomers(req, res) {
    const { id } = req.params;

    try {
        let customer = (
            await connection.query(`SELECT * FROM customers WHERE id = $1;`, [
                id,
            ])
        ).rows;

        if (customer.length < 1) {
            return res.sendStatus(201);
        }

        res.send(customer[0]);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(501);
    }
}

async function SetCustomers(req, res) {
    const id = req.params.id;
    const { name, phone, cpf, birthday } = req.body;

    const validClient = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);

    if (validClient.rows.length === 0) {
        console.log(validClient.rows[0]);
        console.log(id);
        return res.status(409).send('Usuarios não encontrado');
    }


    try {
        const updatedData = await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [
            name,
            phone,
            cpf,
            birthday,
            id
        ]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
export { GetCustomers, CreateCustomers, SelectCustomers, SetCustomers }