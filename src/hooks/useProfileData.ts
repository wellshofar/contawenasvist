
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ProfileFormData = {
  full_name: string;
  phone: string;
  email: string;
};

export type ProfileData = {
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  avatar_url?: string | null;
} | null;

export const useProfileData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Try to get profile data including avatar_url
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, email, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If error is about avatar_url not existing, try without it
        if (error.message.includes("avatar_url")) {
          const { data: basicData, error: basicError } = await supabase
            .from('profiles')
            .select('full_name, phone, email')
            .eq('id', user.id)
            .single();
          
          if (basicError) throw basicError;
          
          setProfileData(basicData);
        } else {
          throw error;
        }
      } else {
        setProfileData(data);
        
        // Download and display avatar
        if (data?.avatar_url) {
          downloadAvatar(data.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAvatar = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
        
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error downloading avatar:', error);
    }
  };

  const updateProfile = async (data: ProfileFormData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Create update data
      const updateData = {
        full_name: data.full_name,
        phone: data.phone,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Email update needs to be handled separately via auth API
      if (data.email !== user.email) {
        const { error: updateEmailError } = await supabase.auth.updateUser({
          email: data.email
        });
        
        if (updateEmailError) throw updateEmailError;
        
        toast({
          title: "E-mail atualizado",
          description: "Uma confirmação foi enviada para seu novo e-mail.",
        });
      }
      
      // Update local state
      setProfileData({
        ...profileData,
        ...updateData
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar seus dados.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isLoading,
    profileData,
    avatarUrl,
    setAvatarUrl,
    updateProfile,
    fetchProfile
  };
};
