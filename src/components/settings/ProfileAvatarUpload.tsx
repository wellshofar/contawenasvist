
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProfileAvatarUploadProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
  profile: any;
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({ 
  avatarUrl, 
  setAvatarUrl, 
  profile 
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione uma imagem para fazer upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      // First, ensure the avatars bucket exists
      let { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');

      if (!avatarBucketExists) {
        // Create the avatars bucket if it doesn't exist
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Try to set avatar_url via RPC function to avoid column existence issues
      const { error: rpcError } = await supabase.rpc(
        'update_profile_avatar_url',
        { 
          user_id: user?.id,
          avatar_url_value: filePath
        }
      );
        
      if (rpcError) {
        console.error('Error updating profile with avatar URL:', rpcError);
      }
      
      setAvatarUrl(publicUrl.publicUrl);
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <Label htmlFor="avatar" className="cursor-pointer">
        <div className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-md">
          <Upload size={16} />
          <span>{uploading ? "Carregando..." : "Alterar Foto"}</span>
        </div>
        <Input 
          id="avatar" 
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </Label>
    </div>
  );
};

export default ProfileAvatarUpload;
