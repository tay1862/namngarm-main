'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingPage } from '@/components/shared/Loading';
import ImagePicker from '@/components/admin/forms/ImagePicker';
import * as Tabs from '@radix-ui/react-tabs';

const languages = [
  { code: 'lo', label: 'ພາສາລາວ', flag: '🇱🇦' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('lo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      siteName_lo: '',
      siteName_th: '',
      siteName_zh: '',
      siteName_en: '',
      defaultMetaDesc_lo: '',
      defaultMetaDesc_th: '',
      defaultMetaDesc_zh: '',
      defaultMetaDesc_en: '',
      email: '',
      phone: '',
      address_lo: '',
      address_th: '',
      address_zh: '',
      address_en: '',
      facebookPage: '',
      lineId: '',
      whatsapp: '',
      logo: '',
    },
  });

  const logo = watch('logo') || '';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();

      if (data.success) {
        reset(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Configure your website settings</p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List className="flex gap-2 border-b mb-6">
                {languages.map((lang) => (
                  <Tabs.Trigger
                    key={lang.code}
                    value={lang.code}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-pink-600 data-[state=active]:border-b-2 data-[state=active]:border-pink-600 transition-colors"
                  >
                    {lang.flag} {lang.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {languages.map((lang) => (
                <Tabs.Content key={lang.code} value={lang.code} className="space-y-4">
                  <Input
                    label={`Site Name (${lang.label})`}
                    {...register(`siteName_${lang.code}` as any)}
                    placeholder="NAMNGAM"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Meta Description ({lang.label})
                    </label>
                    <textarea
                      {...register(`defaultMetaDesc_${lang.code}` as any)}
                      rows={3}
                      className="input"
                      placeholder="Default SEO description for your website"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address ({lang.label})
                    </label>
                    <textarea
                      {...register(`address_${lang.code}` as any)}
                      rows={2}
                      className="input"
                      placeholder="Full address"
                    />
                  </div>
                </Tabs.Content>
              ))}
            </Tabs.Root>

            <div className="mt-6 pt-6 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Logo
              </label>
              <ImagePicker
                value={logo}
                onChange={(url) => setValue('logo', url)}
                label="Upload Logo"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              placeholder="contact@namngam.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              placeholder="+856 20 1234 5678"
            />
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Facebook Page URL"
              {...register('facebookPage')}
              placeholder="https://facebook.com/namngam"
            />
            <Input
              label="LINE ID"
              {...register('lineId')}
              placeholder="@namngam"
            />
            <Input
              label="WhatsApp Number"
              {...register('whatsapp')}
              placeholder="8562012345678"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
