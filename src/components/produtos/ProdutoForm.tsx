
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

const produtoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  categoria: z.string().min(1, { message: "Categoria é obrigatória" }),
  modelo: z.string().min(1, { message: "Modelo é obrigatório" }),
  descricao: z.string().optional().or(z.literal("")),
  prazoManutencao: z.string().min(1, { message: "Prazo de manutenção é obrigatório" }),
});

export type ProdutoFormValues = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  defaultValues: ProdutoFormValues;
  onSubmit: (values: ProdutoFormValues) => Promise<void>;
  isEditing: boolean;
  onCancel: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  isEditing,
  onCancel
}) => {
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Purificador">Purificador</SelectItem>
                      <SelectItem value="Filtro">Filtro</SelectItem>
                      <SelectItem value="Filtro Industrial">Filtro Industrial</SelectItem>
                      <SelectItem value="Bebedouro">Bebedouro</SelectItem>
                      <SelectItem value="Acessório">Acessório</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prazoManutencao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo de Manutenção</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um prazo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3 meses">3 meses</SelectItem>
                      <SelectItem value="6 meses">6 meses</SelectItem>
                      <SelectItem value="12 meses">12 meses</SelectItem>
                      <SelectItem value="18 meses">18 meses</SelectItem>
                      <SelectItem value="24 meses">24 meses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProdutoForm;
