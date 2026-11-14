/**
 * Zod Request Validation Middleware
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on input parameters',
      errors: error.errors?.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })) || [{ message: error.message }],
    });
  }
};
