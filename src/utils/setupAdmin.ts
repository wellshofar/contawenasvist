
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/supabase";

/**
 * Creates an admin user if needed
 * This should only be called by someone with admin privileges
 */
export const createAdminUser = async (email: string, password: string, fullName: string) => {
  try {
    // Check if we have permissions to do this
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      throw new Error("You must be logged in to create an admin user");
    }
    
    // Check if the current user is an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError || !profileData || profileData.role !== 'admin') {
      throw new Error("Only existing administrators can create new admin users");
    }
    
    // Create the new user
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (signUpError || !newUser.user) {
      throw signUpError || new Error("Failed to create user");
    }
    
    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' as UserRole })
      .eq('id', newUser.user.id);
      
    if (updateError) {
      throw updateError;
    }
    
    return { success: true, user: newUser.user };
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

/**
 * Updates a user's role
 * This should only be called by an admin
 */
export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    // Check if we have permissions to do this
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      throw new Error("You must be logged in to update user roles");
    }
    
    // Check if the current user is an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError || !profileData || profileData.role !== 'admin') {
      throw new Error("Only administrators can update user roles");
    }
    
    // Update the user's role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
