
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "@/types/agendamentos";

interface DateTimePickerProps {
  form: UseFormReturn<AppointmentFormValues>;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="scheduledDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data e Hora</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full pl-3 text-left font-normal"
                >
                  {field.value ? (
                    format(field.value, "PPP 'às' HH:mm", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione a data e hora</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  if (date) {
                    const currentValue = field.value;
                    const hours = currentValue.getHours();
                    const minutes = currentValue.getMinutes();
                    
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    
                    field.onChange(date);
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
              <div className="p-3 border-t border-border">
                <Input
                  type="time"
                  value={format(field.value, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const newDate = new Date(field.value);
                    newDate.setHours(hours);
                    newDate.setMinutes(minutes);
                    field.onChange(newDate);
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateTimePicker;
