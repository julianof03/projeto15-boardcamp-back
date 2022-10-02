import joi from "joi";

const CategorieSchema = joi.object({
    name: joi.string().trim().required(),
  });

function validateCategorieAddSchema(req, res, next){
    console.log(req.body);
    const validation = CategorieSchema.validate(req.body, { abortEarly: false });
    
    if (validation.error) {
        return res.status(400).send({ message: validation.error.message });
    }
    next();
  }


export default validateCategorieAddSchema;