
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SMTPFormValues } from "./SMTPSchema";

interface SMTPSenderFieldsProps {
  form: UseFormReturn<SMTPFormValues>;
}

const SMTPSenderFields: React.FC<SMTPSenderFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="smtpFromEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email do Remetente</FormLabel>
            <FormControl>
              <Input placeholder="noreply@suaempresa.com" {...field} />
            </FormControl>
            <FormDescription>
              Email que aparecerá como remetente
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtpFromName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Remetente</FormLabel>
            <FormControl>
              <Input placeholder="Hoken Service" {...field} />
            </FormControl>
            <FormDescription>
              Nome que aparecerá como remetente
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SMTPSenderFields;
