import { z } from 'zod';

/**
 * Validation schema for creating a new Service Request
 */
export const createServiceRequestValidationSchema = z.object({
  serviceProviderId: z.number().int({ message: 'Service provider ID must be a number' }),
  packageId: z.number().int({ message: 'Package ID must be a number' }),
  urgentLevel: z
    .number()
    .int()
    .min(1, 'Urgent level must be at least 1')
    .max(5, 'Urgent level cannot exceed 5'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contactNumber: z.string().min(5, 'Contact number is required'),
  preferredDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Preferred date must be valid (YYYY-MM-DD)'),
  preferredTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Preferred time must be valid (HH:MM:SS)'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
});

/**
 * Validation schema for updating an existing Service Request
 */
export const updateServiceRequestValidationSchema = z.object({
  serviceProviderId: z.number().int().optional(),
  packageId: z.number().int().optional(),
  urgentLevel: z.number().int().min(1).max(5).optional(),
  description: z.string().min(5).optional(),
  address: z.string().min(5).optional(),
  contactNumber: z.string().min(5).optional(),
  preferredDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Preferred date must be valid')
    .optional(),
  preferredTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Preferred time must be valid (HH:MM:SS)')
    .optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
});


export const createModificationValidationSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  timeRequired: z.string().optional(),
  serviceRequestId: z.number().int({ message: 'Service request ID must be a number' }),
});

export const updateModificationValidationSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});
