import type { Metadata } from 'next';

import InnerHero from '@/components/InnerHero';
import { getSiteSettings } from '@/lib/settings/queries';

import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | LaMa Convenience',
  description: 'Get in touch with the LaMa Convenience team.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        imageAlt="LaMa food on orange"
      />
      <ContactClient settings={settings} />
    </div>
  );
}
