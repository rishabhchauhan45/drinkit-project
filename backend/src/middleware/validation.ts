import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    email: z.string().email(),
    phone: z.string().min(10),
    name: z.string().min(2),
    age: z.number().min(18),
    password: z.string().min(6),
  });

  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ message: 'Validation failed', errors: error.errors });
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    password: z.string().min(6),
  }).refine(data => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });

  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ message: 'Validation failed', errors: error.errors });
  }
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    products: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1)
    })).min(1),
  });

  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ message: 'Validation failed', errors: error.errors });
  }
};
