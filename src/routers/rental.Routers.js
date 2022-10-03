import { GetRentals, postRentals,
         returnRentals, DeleteRent
   } from "../controllers/rental.controller.js";
import RentalValidate from "../middlewares/rental.middlewares.js";  
import  express  from "express";

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', RentalValidate, postRentals)
router.post('/rentals/:id/return', returnRentals)
router.delete('/rentals/:id', DeleteRent)

export default router;