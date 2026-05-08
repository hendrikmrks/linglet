import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'auth.confirmPasswordRequired'),
  firstName: z.string().min(1, 'First name is required').max(60, 'First name must be at most 60 characters'),
  lastName: z.string().min(1, 'Last name is required').max(60, 'Last name must be at most 60 characters'),
  birthDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Birth date is required'),
  learningLanguage: z.enum(['de', 'en', 'pt-br']),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'auth.passwordsDoNotMatch',
      path: ['confirmPassword'],
    });
  }
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const avatarUrlSchema = z
  .string()
  .url('Invalid URL')
  .or(z.string().startsWith('data:image/'))
  .or(z.literal(''));

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  avatarUrl: avatarUrlSchema.optional(),
  learningLanguage: z.enum(['de', 'en', 'pt-br']).optional(),
  showFullName: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
