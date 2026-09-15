'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

import ImageField from '@/components/admin/ImageField';
import {
  SITE_SETTING_FIELDS,
  type SiteSettings,
} from '@/lib/settings/keys';
import type { FaqView, HeroSlideView } from '@/lib/settings/queries';

type SlideDraft = Omit<HeroSlideView, 'id'>;

function emptySlide(sortOrder: number): SlideDraft {
  return {
    italicText: '',
    headline: '',
    bodyText: '',
    image: '',
    alt: '',
    ctaText: 'Learn more',
    ctaLink: '/',
    priceAmount: null,
    priceLabel: null,
    sortOrder,
    published: true,
  };
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

export default function SettingsAdmin({
  initialSettings,
  initialFaqs,
  initialSlides,
}: {
  initialSettings: SiteSettings;
  initialFaqs: FaqView[];
  initialSlides: HeroSlideView[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [slides, setSlides] = useState(initialSlides);

  const [settingsBusy, setSettingsBusy] = useState(false);
  const [faqBusy, setFaqBusy] = useState<string | 'new' | null>(null);
  const [slideEditing, setSlideEditing] = useState<{
    id: number | null;
    draft: SlideDraft;
  } | null>(null);
  const [slideBusy, setSlideBusy] = useState<number | 'save' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function saveSettings() {
    setError(null);
    setNotice(null);
    setSettingsBusy(true);

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    setSettingsBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not save settings.');
      return;
    }

    setSettings((await res.json()).settings);
    setNotice('Contact details and social links saved.');
  }

  async function refreshFaqs() {
    const res = await fetch('/api/admin/faqs?section=rewards');
    if (res.ok) setFaqs((await res.json()).faqs);
  }

  async function saveFaq(faq: FaqView) {
    setError(null);
    setFaqBusy(faq.id);

    const res = await fetch('/api/admin/faqs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });

    setFaqBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not save the FAQ.');
      return;
    }

    await refreshFaqs();
  }

  async function addFaq() {
    setError(null);
    setFaqBusy('new');

    const res = await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'rewards',
        question: 'New question',
        answer: 'Answer goes here.',
        sortOrder: faqs.length,
      }),
    });

    setFaqBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not add the FAQ.');
      return;
    }

    await refreshFaqs();
  }

  async function deleteFaq(id: string) {
    if (!window.confirm('Delete this FAQ?')) return;

    setError(null);
    setFaqBusy(id);
    const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
    setFaqBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the FAQ.');
      return;
    }

    await refreshFaqs();
  }

  async function refreshSlides() {
    const res = await fetch('/api/admin/hero');
    if (res.ok) setSlides((await res.json()).slides);
  }

  async function saveSlide() {
    if (!slideEditing) return;

    setError(null);
    setSlideBusy('save');

    const body =
      slideEditing.id === null
        ? slideEditing.draft
        : { id: slideEditing.id, ...slideEditing.draft };

    const res = await fetch('/api/admin/hero', {
      method: slideEditing.id === null ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSlideBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not save the slide.');
      return;
    }

    setSlideEditing(null);
    await refreshSlides();
  }

  async function deleteSlide(id: number) {
    if (!window.confirm('Delete this hero slide?')) return;

    setError(null);
    setSlideBusy(id);
    const res = await fetch(`/api/admin/hero?id=${id}`, { method: 'DELETE' });
    setSlideBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the slide.');
      return;
    }

    await refreshSlides();
  }

  return (
    <div className="space-y-10 p-6 md:p-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Site settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Contact details, social links, rewards FAQs, and homepage hero slides.
        </p>
      </header>

      {error && (
        <div
          className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {notice}
        </div>
      )}

      {/* Contact & social */}
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-xl font-black text-gray-900">
          Contact & social
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          These do not exist anywhere in the codebase today as real values. Leave
          a field blank and the matching link or card stays hidden until you have
          a confirmed number or URL.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SITE_SETTING_FIELDS.map((field) => {
            const camel = field.key.replace(/_([a-z])/g, (_, c: string) =>
              c.toUpperCase(),
            ) as keyof SiteSettings;

            return (
              <div key={field.key}>
                <label htmlFor={field.key} className={labelClass}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={settings[camel]}
                  onChange={(e) =>
                    setSettings({ ...settings, [camel]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">{field.help}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={saveSettings}
          disabled={settingsBusy}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {settingsBusy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save size={18} />
              Save contact details
            </>
          )}
        </button>
      </section>

      {/* Hero slides */}
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Homepage hero slides
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Live promotional copy ("20% off any coffee", "$6.99 combo") lives
              here so it can change without a deploy.
            </p>
          </div>
          <button
            onClick={() =>
              setSlideEditing({
                id: null,
                draft: emptySlide(slides.length),
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
          >
            <Plus size={16} />
            Add slide
          </button>
        </div>

        {slideEditing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSlide();
            }}
            className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                {slideEditing.id === null ? 'New slide' : 'Edit slide'}
              </h3>
              <button
                type="button"
                onClick={() => setSlideEditing(null)}
                className="rounded p-1.5 text-gray-500 hover:bg-white"
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Eyebrow</label>
                <input
                  value={slideEditing.draft.italicText}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        italicText: e.target.value,
                      },
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  value={slideEditing.draft.headline}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        headline: e.target.value,
                      },
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Body</label>
                <textarea
                  value={slideEditing.draft.bodyText}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        bodyText: e.target.value,
                      },
                    })
                  }
                  required
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>CTA label</label>
                <input
                  value={slideEditing.draft.ctaText}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        ctaText: e.target.value,
                      },
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>CTA link</label>
                <input
                  value={slideEditing.draft.ctaLink}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        ctaLink: e.target.value,
                      },
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Price amount</label>
                <input
                  value={slideEditing.draft.priceAmount ?? ''}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        priceAmount: e.target.value || null,
                      },
                    })
                  }
                  placeholder="$3.99"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Price label</label>
                <input
                  value={slideEditing.draft.priceLabel ?? ''}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        priceLabel: e.target.value || null,
                      },
                    })
                  }
                  placeholder="Mix & Match"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Image alt text</label>
                <input
                  value={slideEditing.draft.alt}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: { ...slideEditing.draft, alt: e.target.value },
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sort order</label>
                <input
                  type="number"
                  value={slideEditing.draft.sortOrder}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        sortOrder: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <ImageField
                  value={slideEditing.draft.image}
                  onChange={(url) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: { ...slideEditing.draft, image: url },
                    })
                  }
                  folder="settings"
                  label="Slide image"
                />
              </div>
              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={slideEditing.draft.published}
                  onChange={(e) =>
                    setSlideEditing({
                      ...slideEditing,
                      draft: {
                        ...slideEditing.draft,
                        published: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Published on the homepage
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={slideBusy === 'save'}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              {slideBusy === 'save' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save slide
                </>
              )}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {slides.length === 0 && (
            <p className="text-sm text-gray-500">No hero slides yet.</p>
          )}
          {slides.map((slide) => (
            <article
              key={slide.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {slide.italicText}
                </p>
                <h3 className="font-black text-gray-900">{slide.headline}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {slide.bodyText}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Order {slide.sortOrder} ·{' '}
                  {slide.published ? 'Published' : 'Hidden'} · {slide.ctaText} →{' '}
                  {slide.ctaLink}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setSlideEditing({
                      id: slide.id,
                      draft: {
                        italicText: slide.italicText,
                        headline: slide.headline,
                        bodyText: slide.bodyText,
                        image: slide.image,
                        alt: slide.alt,
                        ctaText: slide.ctaText,
                        ctaLink: slide.ctaLink,
                        priceAmount: slide.priceAmount,
                        priceLabel: slide.priceLabel,
                        sortOrder: slide.sortOrder,
                        published: slide.published,
                      },
                    })
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSlide(slide.id)}
                  disabled={slideBusy === slide.id}
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Delete ${slide.headline}`}
                >
                  {slideBusy === slide.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Rewards FAQs
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Shown on the rewards page. Order is the number on each row.
            </p>
          </div>
          <button
            onClick={addFaq}
            disabled={faqBusy === 'new'}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {faqBusy === 'new' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={faq.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  #{index + 1}
                </span>
                <button
                  onClick={() => deleteFaq(faq.id)}
                  disabled={faqBusy === faq.id}
                  className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label="Delete FAQ"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <label className={labelClass}>Question</label>
              <input
                value={faq.question}
                onChange={(e) =>
                  setFaqs((current) =>
                    current.map((item) =>
                      item.id === faq.id
                        ? { ...item, question: e.target.value }
                        : item,
                    ),
                  )
                }
                className={`${inputClass} mb-3`}
              />

              <label className={labelClass}>Answer</label>
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  setFaqs((current) =>
                    current.map((item) =>
                      item.id === faq.id
                        ? { ...item, answer: e.target.value }
                        : item,
                    ),
                  )
                }
                rows={3}
                className={`${inputClass} mb-3`}
              />

              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className={labelClass}>Sort order</label>
                  <input
                    type="number"
                    value={faq.sortOrder}
                    onChange={(e) =>
                      setFaqs((current) =>
                        current.map((item) =>
                          item.id === faq.id
                            ? {
                                ...item,
                                sortOrder: Number(e.target.value) || 0,
                              }
                            : item,
                        ),
                      )
                    }
                    className={`${inputClass} w-28`}
                  />
                </div>
                <button
                  onClick={() => saveFaq(faq)}
                  disabled={faqBusy === faq.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {faqBusy === faq.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
