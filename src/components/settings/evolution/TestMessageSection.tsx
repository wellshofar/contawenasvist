
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EvolutionApiFormValues } from "./EvolutionApiSchema";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);

  const handleTestMessage = async () => {
    setTestSent(false);
    setError(null);
    
    try {
      await onTestMessage();
      setTestSent(true);
    } catch (err) {
      console.error("Erro ao enviar mensagem de teste:", err);
      setError("Falha ao enviar mensagem. Verifique o console para mais detalhes.");
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
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
