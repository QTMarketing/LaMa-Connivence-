'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Paperclip, Send } from 'lucide-react';

import {
  CV_ACCEPT_ATTRIBUTE,
  MAX_CV_BYTES,
  MAX_CV_LABEL,
} from '@/lib/careers/upload';

interface ApplicationFormProps {
  /** Omitted for a general application not tied to a posting. */
  jobId?: string;
  jobTitle: string;
}

const inputClass =
  'w-full rounded-md border border-[#E2E8F0] bg-white px-4 py-3 text-[#1A1A1A] transition-colors focus:border-[#FF6B35] focus:outline-none';

const labelClass = 'mb-2 block text-sm font-semibold text-[#1A1A1A]';

export default function ApplicationForm({
  jobId,
  jobTitle,
}: ApplicationFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const cv = formData.get('cv');
    if (cv instanceof File && cv.size > 0 && cv.size > MAX_CV_BYTES) {
      setError(`Your CV must be under ${MAX_CV_LABEL}.`);
      return;
    }

    if (jobId) formData.set('jobId', jobId);
    formData.set('jobTitle', jobTitle);

    setStatus('sending');

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'We could not send your application. Please try again.',
        );
        setStatus('idle');
        return;
      }

      form.reset();
      setCvName(null);
      setStatus('sent');
    } catch (err) {
      console.error('Application submit failed:', err);
      setError(
        'We could not reach the server. Please check your connection and try again.',
      );
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div
        className="rounded-md border border-[#E2E8F0] bg-white p-8 text-center"
        role="status"
      >
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35]">
          <CheckCircle2 size={24} className="text-[#1A1A1A]" />
        </span>
        <h3 className="typography-h4 mb-2 text-[#1A1A1A]">Application sent</h3>
        <p className="typography-body mx-auto max-w-md text-[#444444]">
          Thanks for applying for {jobTitle}. Our hiring team reviews every
          application and will get in touch if you are a fit.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-[#FF6B35] underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-[#E2E8F0] bg-white p-6 md:p-8"
      aria-label={`Application form for ${jobTitle}`}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name <span className="text-[#FF6B35]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="text-[#FF6B35]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={40}
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-[#FF6B35]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="coverLetter" className={labelClass}>
            Why do you want this job?
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={5}
            maxLength={4000}
            placeholder="Tell us about your availability and any experience you have. Optional."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="cv" className={labelClass}>
            CV or resume
          </label>
          <label
            htmlFor="cv"
            className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-[#E2E8F0] bg-[#F7F7F7] px-4 py-4 transition-colors hover:border-[#FF6B35]"
          >
            <Paperclip size={18} className="shrink-0 text-[#4A5568]" />
            <span className="typography-body text-[#444444]">
              {cvName ?? `PDF, DOC or DOCX, up to ${MAX_CV_LABEL}`}
            </span>
          </label>
          <input
            id="cv"
            name="cv"
            type="file"
            accept={CV_ACCEPT_ATTRIBUTE}
            className="sr-only"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)}
          />
          <p className="mt-2 text-xs text-[#4A5568]">
            Optional, but it helps us move faster.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary mt-6 gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            <Send size={18} />
            Submit application
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-[#4A5568]">
        We use your details only to consider you for work at LaMa Convenience.
      </p>
    </form>
  );
}
