
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EvolutionApiFormValues } from "./EvolutionApiSchema";

interface TestMessageSectionProps {
  form: UseFormReturn<EvolutionApiFormValues>;
  isLoading: boolean;
  onTestMessage: () => Promise<void>;
}

const TestMessageSection: React.FC<TestMessageSectionProps> = ({ 
  form, 
  isLoading, 
  onTestMessage 
}) => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-2">Teste da Integração</h3>
      <FormField
        control={form.control}
        name="testNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número para Teste</FormLabel>
            <FormControl>
              <Input placeholder="5511999998888" {...field} />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Formato: código do país + DDD + número (ex: 5511999998888)
            </p>
          </FormItem>
        )}
      />
      <div className="mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onTestMessage}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Enviando..." : "Enviar Mensagem de Teste"}
        </Button>
      </div>
    </div>
  );
};

export default TestMessageSection;
