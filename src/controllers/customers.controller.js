import connection from "../database.js";


async function GetCustomers(req, res) {
    try {
        const customers = await connection.query(
            'SELECT * FROM customers'
        );
        res.status(201).send(customers.rows);

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
    const id = req.params.id;

    try {
        const customers = await connection.query(
            "SELECT * FROM customers WHERE id = $1", [id]
        );

        if (customers.rows.length === 0) {
            return res.status(404).send({ message: "esse usuario não existe" });
        }

        res.status(201).send(customers.rows);
    } catch (error) {
        res.status(501).send({ message: error.message });
    }
}

async function SetCustomers(req, res) {
    const id = req.params.id;
    const { name, phone, cpf, birthday } = req.body;

    const validCpf = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);

    if (validCpf.rows.length !== 0) {
        return res.status(409).send('Parece que esse cpf ja foi cadastrado');
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