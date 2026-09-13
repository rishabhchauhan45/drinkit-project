import { ZodError } from 'zod';

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('❌ Error:', err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value entered',
      errors: []
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: []
  });
};
