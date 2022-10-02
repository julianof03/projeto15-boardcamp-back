import connection from '../database.js';

async function GetCategories(req, res){
   try{
        const categories = await connection.query(
            'SELECT categories.name, categories.id FROM categories'
        );
        res.status(201).send(categories.rows);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function AddCategories(req, res){
    try{
        const {name} = req.body;
        console.log(name);
          const categories = await connection.query(
              'INSERT INTO categories ("name") VALUES ($1)', [name]
          );
         res.status(201).send(categories.rows);
 
     } catch (error) {
         res.status(500).send({ message: error.message });
     }
 }
 

export {GetCategories, AddCategories};