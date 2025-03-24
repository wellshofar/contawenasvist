
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
    
    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
    
    if (existingUsers && existingUsers.length > 0) {
      // User exists, update their role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin' as UserRole,
          full_name: fullName 
        })
        .eq('email', email);
        
      if (updateError) {
        throw updateError;
      }
      
      return { success: true, message: "User already exists. Role updated to admin." };
    }
    
    // Create the new user
    const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      }
    });
    
    if (signUpError || !newUser.user) {
      throw signUpError || new Error("Failed to create user");
    }
    
    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin' as UserRole,
        full_name: fullName 
      })
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

/**
 * Special function to set up the initial admin user
 * This will create or update the admin user with the provided credentials
 */
export const setupInitialAdmin = async (email: string, password: string, fullName: string) => {
  try {
    console.log("Setting up initial admin user:", email);
    
    // First, check if the user already exists
    const { data: existingUsers, error: queryError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email);
    
    if (queryError) {
      console.error("Error checking for existing user:", queryError);
      throw queryError;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      // User exists, update their role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin' as UserRole,
          full_name: fullName 
        })
        .eq('email', email);
        
      if (updateError) {
        console.error("Error updating existing user to admin:", updateError);
        throw updateError;
      }
      
      console.log("Existing user updated to admin role:", email);
      return { success: true, message: "Existing user updated to admin" };
    }
    
    // Create the new admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (signUpError) {
      console.error("Error creating admin user:", signUpError);
      throw signUpError;
    }
    
    if (!signUpData.user) {
      throw new Error("Failed to create user");
    }
    
    // Update the user's profile to give them admin role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin' as UserRole,
        full_name: fullName 
      })
      .eq('id', signUpData.user.id);
      
    if (updateError) {
      console.error("Error setting user role to admin:", updateError);
      throw updateError;
    }
    
    // Confirm the email automatically (if possible in this context)
    const { error: confirmError } = await supabase.auth.admin.updateUserById(
      signUpData.user.id,
      { email_confirm: true }
    );
    
    if (confirmError) {
      console.error("Could not auto-confirm email:", confirmError);
      // This is not a fatal error, so we don't throw
    }
    
    console.log("Initial admin user created successfully:", email);
    return { success: true, user: signUpData.user };
  } catch (error) {
    console.error("Error in setupInitialAdmin:", error);
    throw error;
  }
};
