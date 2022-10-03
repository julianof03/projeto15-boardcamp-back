import { GetRentals
   } from "../controllers/rental.controller.js";
import  express  from "express";

const router = express.Router();

router.get('/rentals', GetRentals);

export default router;