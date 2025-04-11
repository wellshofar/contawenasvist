
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    const result = await updateProfile(data);
    setIsSubmitting(false);
    return result;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
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
