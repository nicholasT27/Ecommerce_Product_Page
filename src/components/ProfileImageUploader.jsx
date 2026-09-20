import { useEffect, useState } from 'react';
import defaultAvatar from '../assets/image-avatar.png';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 2 * 1024 * 1024;

export default function ProfileImageUploader() {
  const { avatarUrl, refreshAvatar, user } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const chooseFile = (event) => {
    const selected = event.target.files?.[0];
    setMessage(''); setError('');
    if (!selected) { setFile(null); setPreviewUrl(null); return; }
    if (!allowedTypes.includes(selected.type)) { setFile(null); setPreviewUrl(null); setError('Choose a JPG, PNG, or WebP image.'); return; }
    if (selected.size > maxFileSize) { setFile(null); setPreviewUrl(null); setError('Choose an image smaller than 2 MB.'); return; }
    setFile(selected); setPreviewUrl(URL.createObjectURL(selected));
  };

  const upload = async () => {
    if (!file || !user) return;
    setBusy(true); setError(''); setMessage('');
    try {
      // A stable user-scoped path lets Storage upsert the photo without
      // exposing or overwriting another customer's avatar.
      const avatarPath = `${user.id}/profile-image`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(avatarPath, file, {
        cacheControl: '3600', contentType: file.type, upsert: true,
      });
      if (uploadError) throw uploadError;
      const { error: profileError } = await supabase.from('profiles').update({
        avatar_path: avatarPath, updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (profileError) throw profileError;
      await refreshAvatar();
      setFile(null); setPreviewUrl(null); setMessage('Profile image updated.');
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  };

  return <div className="bg-lgblue rounded-2xl p-6 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <img src={previewUrl || avatarUrl || defaultAvatar} alt="Profile preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-white" />
      <div className="flex-1">
        <h2 className="text-xl font-bold">Profile image</h2>
        <p className="text-sm text-dgblue mt-1">JPG, PNG, or WebP. Maximum 2 MB.</p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <label className="cursor-pointer border border-gblue bg-white rounded-xl px-4 py-2 font-bold text-sm hover:border-orange">
            Choose image
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} className="sr-only" />
          </label>
          <button type="button" onClick={upload} disabled={!file || busy} className="bg-orange rounded-xl px-4 py-2 font-bold text-sm disabled:opacity-50">
            {busy ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
        {file && <p className="text-xs text-dgblue mt-3 break-all">Selected: {file.name}</p>}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        {message && <p className="text-sm text-green-700 mt-3">{message}</p>}
      </div>
    </div>
  </div>;
}
