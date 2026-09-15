/**
 * Known site_settings keys. The table is a bag of strings, but the app only
 * reads these — inventing a new key here is how a new editable field is added.
 */
export const SITE_SETTING_KEYS = [
  'contact_phone',
  'contact_email',
  'contact_hours',
  'social_instagram',
  'social_facebook',
  'social_twitter',
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

export interface SiteSettings {
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
}

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  contactPhone: '',
  contactEmail: '',
  contactHours: '',
  socialInstagram: '',
  socialFacebook: '',
  socialTwitter: '',
};

/** Labels and help text for the admin form. */
export const SITE_SETTING_FIELDS: Array<{
  key: SiteSettingKey;
  label: string;
  help: string;
  placeholder: string;
  type: 'text' | 'email' | 'url' | 'tel';
}> = [
  {
    key: 'contact_phone',
    label: 'Contact phone',
    help: 'Shown on the contact page. Leave blank until a real number is confirmed.',
    placeholder: '(555) 555-0100',
    type: 'tel',
  },
  {
    key: 'contact_email',
    label: 'Contact email',
    help: 'Public enquiries address. Not the same as CAREERS_NOTIFY_EMAIL.',
    placeholder: 'hello@example.com',
    type: 'email',
  },
  {
    key: 'contact_hours',
    label: 'Contact hours',
    help: 'Free text, e.g. "Mon–Fri 9am–5pm CT".',
    placeholder: 'Mon–Fri 9am–5pm',
    type: 'text',
  },
  {
    key: 'social_instagram',
    label: 'Instagram URL',
    help: 'Full profile URL. Empty hides the icon in the footer.',
    placeholder: 'https://instagram.com/lama',
    type: 'url',
  },
  {
    key: 'social_facebook',
    label: 'Facebook URL',
    help: 'Full page URL. Empty hides the icon in the footer.',
    placeholder: 'https://facebook.com/lama',
    type: 'url',
  },
  {
    key: 'social_twitter',
    label: 'X / Twitter URL',
    help: 'Full profile URL. Empty hides the icon in the footer.',
    placeholder: 'https://x.com/lama',
    type: 'url',
  },
];

export function rowsToSettings(
  rows: Array<{ key: string; value: string }>,
): SiteSettings {
  const map = new Map(rows.map((row) => [row.key, row.value]));

  return {
    contactPhone: map.get('contact_phone') ?? '',
    contactEmail: map.get('contact_email') ?? '',
    contactHours: map.get('contact_hours') ?? '',
    socialInstagram: map.get('social_instagram') ?? '',
    socialFacebook: map.get('social_facebook') ?? '',
    socialTwitter: map.get('social_twitter') ?? '',
  };
}
