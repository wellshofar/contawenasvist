
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarUploadProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  profile: any; // Using any here because the profile type might vary
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({
  avatarUrl,
  setAvatarUrl,
  profile,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || !event.target.files[0]) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}.${fileExt}`;
      
      // Check if avatars bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
      }
      
      // Upload the file to the avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the avatar
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);
      
      // Update the user's avatar URL in the database using the RPC function
      const { error: updateError } = await supabase.rpc(
        'update_profile_avatar_url',
        { 
          user_id: profile.id, 
          avatar_url_value: newAvatarUrl 
        }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso",
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message || "Ocorreu um erro ao atualizar seu avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setIsUploading(true);
      
      if (!avatarUrl) return;
      
      // Extract filename from URL
      const fileName = avatarUrl.split('/').pop();
      
      if (fileName) {
        // Remove from storage
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove([fileName]);
          
        if (removeError) {
          throw removeError;
        }
      }
      
      // Update the user's avatar URL in the database
      const { error: updateError } = await supabase.rpc(
        'update_profile_avatar_url',
        { 
          user_id: profile.id, 
          avatar_url_value: null 
        }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(null);
      
      toast({
        title: "Avatar removido",
        description: "Seu avatar foi removido com sucesso",
      });
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Erro ao remover avatar",
        description: error.message || "Ocorreu um erro ao remover seu avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col items-center p-0 pb-6">
        <div className="relative mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="text-3xl">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" /> Atualizar
          </Button>
          {avatarUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={removeAvatar} 
              disabled={isUploading}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Remover
            </Button>
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatarUpload;
