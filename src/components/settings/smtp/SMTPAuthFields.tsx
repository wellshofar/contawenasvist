
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SMTPFormValues } from "./SMTPSchema";

interface SMTPAuthFieldsProps {
  form: UseFormReturn<SMTPFormValues>;
}

const SMTPAuthFields: React.FC<SMTPAuthFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="smtpUser"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário</FormLabel>
            <FormControl>
              <Input placeholder="seu-email@gmail.com" {...field} />
            </FormControl>
            <FormDescription>
              Usuário para autenticação SMTP
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtpPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormDescription>
              Senha para autenticação SMTP
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SMTPAuthFields;
