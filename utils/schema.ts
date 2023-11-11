import { z } from 'zod'

export const signUpSchema = z.object({
  fullName: z.string({
    required_error: 'Le nom complet est requis',
    invalid_type_error: 'Le nom complet doit être une chaîne de caractères',
  }).min(4, 'Trop court - 4 caractères minimum')
    .max(25, 'Trop long - 25 caractères maximum'),

  phone: z.string({
    required_error: 'Le numéro de téléphone est requis',
    invalid_type_error: 'Le numéro de téléphone doit être une chaîne de caractères',
  })
    .regex(/^\d{10}$/, 'Le numéro de téléphone doit être composé de 10 chiffres'),

  email: z.string(
    {
      required_error: 'L\'email est requis',
      invalid_type_error: 'L\'email doit être une chaîne de caractères',
    },
  ).email('Cet email n\'est pas valide'),

  password: z.string()
    .min(8, 'Trop court - 8 caractères minimum')
    .max(25, 'Trop long - 25 caractères maximum'),
})

export const signInSchema = z.object({
  email: z.string(
    {
      required_error: 'L\'email est requis',
      invalid_type_error: 'L\'email doit être une chaîne de caractères',
    },
  ).email('Cet email n\'est pas valide'),

  password: z.string()
    .min(8, 'Trop court - 8 caractères minimum')
    .max(25, 'Trop long - 25 caractères maximum'),
})

export const basketSchema = z.object({
  itemId: z.number({
    required_error: 'Le produit est requis',
    invalid_type_error: 'Ce produit n\'existe pas',
  }),
  itemName: z.string({
    required_error: 'Le produit est requis',
    invalid_type_error: 'Ce produit n\'existe pas',
  }),
  quantity: z.number({
    required_error: 'La quantité est requise',
    invalid_type_error: 'La quantité doit être d\'au moins 1',
  }).min(1, 'La quantité doit être d\'au moins 1'),
  price: z.number({
    required_error: 'Le prix est requis',
    invalid_type_error: 'Le prix doit être un nombre',
  }),
  total: z.number({
    required_error: 'Le total est requis',
    invalid_type_error: 'Le total doit être un nombre',
  }),
})

export const customerSchema = z.object({
  id: z.number({
    required_error: 'L\'id est requis',
    invalid_type_error: 'L\'id doit être un nombre',
  }).optional(),
  name: z.string({
    required_error: 'Le nom est requis',
    invalid_type_error: 'Le nom doit être une chaîne de caractères',
  }).min(4, 'Le nom du client est trop court (4 min)'),
  phone: z.string({
    required_error: 'Le numéro de téléphone est requis',
    invalid_type_error: 'Le numéro de téléphone doit être une chaîne de caractères',
  }).regex(/^\d{10}$/, 'Le numéro de téléphone doit être composé de 10 chiffres'),
  address: z.string({
    invalid_type_error: 'L\'adresse doit être une chaîne de caractères',
  }).nullish(),
  created_at: z.date({
    required_error: 'La date de création est requise',
    invalid_type_error: 'La date de création doit être une date',
  }).optional(),
  updated_at: z.date({
    required_error: 'La date de modification est requise',
    invalid_type_error: 'La date de modification doit être une date',
  }).optional(),
})

// export types
export type TSignUpSchema = z.infer<typeof signUpSchema>
export type TSignInSchema = z.infer<typeof signInSchema>
export type TBasketSchema = z.infer<typeof basketSchema>
export type TCustomerSchema = z.infer<typeof customerSchema>
