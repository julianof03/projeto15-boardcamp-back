

import { CreateCustomers, GetCustomers,
        SelectCustomers, SetCustomers
       } from "../controllers/customers.controller.js";
import CustomerValidate from "../middlewares/customers.middlewares.js";
import  express  from "express";

const router = express.Router();

router.get('/customers', GetCustomers);
router.post('/customers', CustomerValidate, CreateCustomers);
router.get("/customers/:id", SelectCustomers);
router.put('/customers/:id', CustomerValidate, SetCustomers);

export default router;