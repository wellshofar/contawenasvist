
import * as z from "zod";

export const smtpFormSchema = z.object({
  smtpHost: z.string().min(1, { message: "O servidor SMTP é obrigatório" }),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpUser: z.string().min(1, { message: "O usuário é obrigatório" }),
  smtpPassword: z.string().min(1, { message: "A senha é obrigatória" }),
  smtpSecure: z.boolean().default(true),
  smtpFromEmail: z.string().email({ message: "Email inválido" }),
  smtpFromName: z.string().min(1, { message: "O nome de remetente é obrigatório" }),
});

export type SMTPFormValues = z.infer<typeof smtpFormSchema>;
