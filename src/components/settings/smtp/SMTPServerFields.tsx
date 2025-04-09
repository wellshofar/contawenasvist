
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SMTPFormValues } from "./SMTPSchema";

interface SMTPServerFieldsProps {
  form: UseFormReturn<SMTPFormValues>;
}

const SMTPServerFields: React.FC<SMTPServerFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="smtpHost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Servidor SMTP</FormLabel>
            <FormControl>
              <Input placeholder="smtp.gmail.com" {...field} />
            </FormControl>
            <FormDescription>
              Endereço do servidor SMTP
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtpPort"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Porta</FormLabel>
            <FormControl>
              <Input type="number" placeholder="587" {...field} />
            </FormControl>
            <FormDescription>
              Porta do servidor SMTP (geralmente 587 ou 465)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SMTPServerFields;
