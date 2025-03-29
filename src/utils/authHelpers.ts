
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminUserData {
  users?: {
    id: string;
    email: string;
  }[];
}

/**
 * Attempts to automatically confirm a user's email if it hasn't been confirmed yet
 * @param email The email address to confirm
 * @returns Boolean indicating if the confirmation was successful
 */
export async function attemptAutomaticEmailConfirmation(email: string): Promise<boolean> {
  try {
    // Try to get the user if they exist
    const { data, error: getUserError } = await supabase.auth.admin.listUsers() as { 
      data: AdminUserData; 
      error: any;
    };
    
    if (getUserError) throw getUserError;
    
    // Find the user with matching email
    const userToConfirm = data?.users?.find(u => u.email === email);
    
    if (!userToConfirm) {
      toast({
        title: "Usuário não encontrado",
        description: "Não foi possível encontrar o usuário para confirmar o email.",
        variant: "destructive",
      });
      return false;
    }
    
    // Try to confirm the user's email
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
      userToConfirm.id,
      { email_confirm: true }
    );
    
    if (updateUserError) throw updateUserError;
    
    toast({
      title: "E-mail confirmado",
      description: "Tentando fazer login novamente...",
    });
    
    return true;
  } catch (confirmError) {
    console.error("Error confirming email:", confirmError);
    toast({
      title: "Erro ao confirmar e-mail",
      description: "Por favor, verifique seu e-mail e clique no link de confirmação.",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Handles login errors and attempts to resolve them
 * @param error The error object from login attempt
 * @param email User's email
 * @param password User's password
 * @param retryLogin Function to retry login
 */
export async function handleLoginError(
  error: any, 
  email: string, 
  password: string,
  retryLogin: () => Promise<{error: any} | void>
): Promise<void> {
  console.error("Login error:", error);
  
  // Check if the error is that the user is not confirmed
  if (error.message.includes("Email not confirmed")) {
    toast({
      title: "E-mail não confirmado",
      description: "Tentando confirmar seu e-mail automaticamente...",
    });
    
    const confirmed = await attemptAutomaticEmailConfirmation(email);
    
    if (confirmed) {
      // Try to login again
      const { error: retryError } = await retryLogin() || { error: null };
      
      if (retryError) {
        toast({
          title: "Erro ao fazer login",
          description: retryError.message,
          variant: "destructive",
        });
      }
    }
  } else {
    toast({
      title: "Erro ao fazer login",
      description: error.message,
      variant: "destructive",
    });
  }
}
