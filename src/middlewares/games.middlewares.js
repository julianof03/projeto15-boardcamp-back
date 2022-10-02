import joi from "joi";

const GamesSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().greater(0).required(),
    categoryId:joi.number().greater(0).required(),
    pricePerDay:joi.number().greater(0).required(),
  });

function validateGameAddSchema(req, res, next){
    console.log(req.body);
    const validation = GamesSchema.validate(req.body, { abortEarly: false });
    
    if (validation.error) {
        return res.status(400).send({ message: validation.error.message });
    }
    next();
  }


export default validateGameAddSchema;