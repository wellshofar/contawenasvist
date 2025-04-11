
import * as z from "zod";

export const webhookFormSchema = z.object({
  webhookUrl: z.string().url({ message: "Por favor, insira uma URL válida" }).optional().or(z.literal("")),
});

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;
