const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      // Validate the request property (body, params, query)
      const validated = schema.safeParse(req[property]);
      
      if (!validated.success) {
        // Zod validation error
        const errors = validated.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          received: err.received // This shows what was actually sent
        }));
        
        return res.status(400).json({
          msg: 'Validation failed',
          errors
        });
      }
      
      // Replace request property with validated data
      req[property] = validated.data;
      
      next();
    } catch (error) {
      // Other errors
      return res.status(400).json({
        msg: 'Invalid request data'
      });
    }
  };
};

export default validate;