
import * as z from "zod";

export const evolutionApiFormSchema = z.object({
  instanceName: z.string().min(1, { message: "Nome da instância é obrigatório" }),
  apiToken: z.string().min(1, { message: "Token da API é obrigatório" }),
  apiBaseUrl: z.string().url({ message: "URL da API deve ser válida" }),
  testNumber: z.string()
    .regex(/^[0-9+]+$/, { message: "Apenas números e '+' são permitidos" })
    .min(10, { message: "Número deve ter pelo menos 10 dígitos" })
    .optional()
    .or(z.literal("")),
});

export type EvolutionApiFormValues = z.infer<typeof evolutionApiFormSchema>;
