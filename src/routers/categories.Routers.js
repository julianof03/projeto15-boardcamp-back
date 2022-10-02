import  express  from "express";
import {GetCategories, AddCategories} from "../controllers/categories.controller.js"
import CategorieSchema from "../middlewares/categories.middlewares.js";

const router = express.Router();

router.get('/categories', GetCategories);
router.post('/categories', CategorieSchema, AddCategories);

export default router;