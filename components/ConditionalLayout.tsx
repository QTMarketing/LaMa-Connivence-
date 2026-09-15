import type { ReactNode } from 'react';

import ConditionalLayoutClient from '@/components/ConditionalLayoutClient';
import { getSiteSettings } from '@/lib/settings/queries';

/**
 * Server wrapper so the footer can receive real contact/social settings without
 * turning the whole layout into a client fetch.
 */
export default async function ConditionalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <ConditionalLayoutClient settings={settings}>
      {children}
    </ConditionalLayoutClient>
  );
}
