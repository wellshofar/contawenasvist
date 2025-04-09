
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SMTPFormValues } from "./SMTPSchema";

interface SMTPSecureToggleProps {
  form: UseFormReturn<SMTPFormValues>;
}

const SMTPSecureToggle: React.FC<SMTPSecureToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="smtpSecure"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Conexão Segura (TLS/SSL)</FormLabel>
            <FormDescription>
              Usar conexão segura para envio de emails
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SMTPSecureToggle;
