
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentFormValues } from "@/types/agendamentos";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import CustomerProductSelectors from "./CustomerProductSelectors";
import DateTimePicker from "./DateTimePicker";
import StatusSelector from "./StatusSelector";
import FormActions from "./FormActions";

interface AgendamentoFormProps {
  isEditing: boolean;
  currentAgendamento: any;
  onClose: () => void;
}

export const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  isEditing,
  currentAgendamento,
  onClose,
}) => {
  const { addAgendamento, updateAgendamento } = useAgendamentos();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      title: isEditing ? currentAgendamento?.title : "",
      description: isEditing ? currentAgendamento?.description : "",
      customerId: isEditing ? currentAgendamento?.customerId : "",
      productId: isEditing ? currentAgendamento?.productId : "",
      scheduledDate: isEditing && currentAgendamento?.scheduledDate
        ? new Date(currentAgendamento.scheduledDate)
        : new Date(),
      status: isEditing ? currentAgendamento?.status : "pending",
    },
  });

  const onSubmit = async (values: AppointmentFormValues) => {
    setSubmitting(true);
    try {
      const success = isEditing
        ? await updateAgendamento({ id: currentAgendamento.id, ...values })
        : await addAgendamento(values);

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Manutenção de filtro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes sobre o agendamento"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CustomerProductSelectors 
          form={form} 
          isEditing={isEditing} 
          currentAgendamento={currentAgendamento} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimePicker form={form} />
          <StatusSelector form={form} />
        </div>

        <FormActions 
          isEditing={isEditing} 
          submitting={submitting} 
          onClose={onClose} 
        />
      </form>
    </Form>
  );
};

export default AgendamentoForm;
