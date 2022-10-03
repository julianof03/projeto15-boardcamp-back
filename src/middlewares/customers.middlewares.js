import joi from "joi";

const CustomerSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().raw().required(),
  });

function validateCustomerddSchema(req, res, next){
    console.log(req.body);
    const validation = CustomerSchema.validate(req.body, { abortEarly: false });
    
    if (validation.error) {
        return res.status(400).send({ message: validation.error.message });
    }
    next();
  } 


export default validateCustomerddSchema;