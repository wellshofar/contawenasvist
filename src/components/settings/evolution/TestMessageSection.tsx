
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EvolutionApiFormValues } from "./EvolutionApiSchema";
import { Loader2 } from "lucide-react";

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
  const [testSent, setTestSent] = useState(false);

  const handleTestMessage = async () => {
    setTestSent(false);
    try {
      await onTestMessage();
      setTestSent(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem de teste:", error);
    }
  };

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
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleTestMessage}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Mensagem de Teste"
          )}
        </Button>
        {testSent && (
          <p className="text-xs text-green-600 mt-2">
            Mensagem de teste enviada. Verifique o telefone informado.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestMessageSection;
