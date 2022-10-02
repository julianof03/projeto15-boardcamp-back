import  express  from "express";
import {AddGames, GetGames} from "../controllers/games.controller.js"
import validateGameAddSchema from "../middlewares/games.middlewares.js";
const router = express.Router();

router.get('/games', GetGames);
router.post('/games', validateGameAddSchema, AddGames);

export default router;