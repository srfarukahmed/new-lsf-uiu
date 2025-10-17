import { z } from 'zod';
import { passwordRegex } from './user.utils';

// Create User (Signup) Validation
export const createUserValidationSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(255, 'First name cannot exceed 255 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(255, 'Last name cannot exceed 255 characters')
    .optional(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 6 characters and include one uppercase letter, one number, and one special character'
    ),
  phone: z.string().max(50).optional(),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']),
  address: z.string().max(255).optional(),
  about: z.string().optional(),
});

// Update User Validation
export const updateUserValidationSchema = z.object({
  first_name: z.string().min(2).max(255).optional(),
  last_name: z.string().min(2).max(255).optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 6 characters and include one uppercase letter, one number, and one special character'
    )
    .optional(),
  phone: z.string().max(50).optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  address: z.string().max(255).optional(),
  about: z.string().optional(),
});

// Update Password Validation
export const updateUserPasswordValidationSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password must be at least 6 characters'),
  newPassword: z
    .string()
    .regex(
      passwordRegex,
      'New password must be at least 6 characters and include one uppercase letter, one number, and one special character'
    ),
});
