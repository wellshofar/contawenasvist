
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EvolutionApiFormValues } from "./EvolutionApiSchema";

interface ApiConfigFieldsProps {
  form: UseFormReturn<EvolutionApiFormValues>;
}

const ApiConfigFields: React.FC<ApiConfigFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="apiBaseUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da API</FormLabel>
            <FormControl>
              <Input placeholder="https://api.chatzapbot.com.br" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="instanceName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Instância</FormLabel>
            <FormControl>
              <Input placeholder="juniorhoken" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="apiToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token da API</FormLabel>
            <FormControl>
              <Input placeholder="Seu token da Evolution API" type="password" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ApiConfigFields;
