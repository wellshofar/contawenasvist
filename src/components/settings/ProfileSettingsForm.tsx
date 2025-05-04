
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProfileFormFields from "./ProfileFormFields";
import { useProfileData, ProfileFormData } from "@/hooks/useProfileData";

const ProfileSettingsForm: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    isLoading, 
    profileData, 
    updateProfile 
  } = useProfileData();

  const handleSubmit = async (data: ProfileFormData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(data);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Perfil</CardTitle>
          <CardDescription>Carregando dados do perfil...</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      <ProfileFormFields
        defaultValues={{
          full_name: profileData?.full_name || '',
          phone: profileData?.phone || '',
          email: profileData?.email || user?.email || '',
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
};

export default ProfileSettingsForm;
