'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

import ApplicationForm from '@/components/careers/ApplicationForm';

export default function HiringPopup({ qaReadOnly = false }: { qaReadOnly?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="hiring-popup-title"
      aria-describedby="hiring-popup-intro"
      onClose={() => setDismissed(true)}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-1.5rem)] max-w-[760px] max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-sm bg-white p-0 text-[#1A1A1A] shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop:bg-[#10100f]/65 md:max-h-[calc(100dvh-3rem)]"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col md:max-h-[calc(100dvh-3rem)]">
        <div className="relative shrink-0 bg-[#252923] px-6 pb-7 pt-9 text-white md:px-10 md:pb-8 md:pt-10">
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            aria-label="Close hiring popup"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-6"
          >
            <X aria-hidden="true" size={22} />
          </button>
          <p className="pr-14 text-xs font-extrabold uppercase tracking-[0.15em] text-[#FFAE80]">
            Join the crew
          </p>
          <h2 id="hiring-popup-title" className="mt-3 max-w-[520px] pr-8 text-[clamp(2rem,5vw,2.9rem)] font-black leading-[1.03] tracking-[-0.045em] text-white">
            Your next shift starts here.
          </h2>
          <p id="hiring-popup-intro" className="mt-3 max-w-[470px] text-sm leading-relaxed text-[#E7E6E1] md:text-base">
            Send your details here. Open roles stay on the{' '}
            <Link href="/careers" className="font-semibold text-white underline underline-offset-2">
              careers page
            </Link>
            .
          </p>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pb-7 pt-6 md:px-10">
          {qaReadOnly ? (
            <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-[#5F3B10]" role="note">
              Local QA preview · applications disabled
            </p>
          ) : (
            <ApplicationForm jobTitle="a role at LaMa" />
          )}
        </div>
      </div>
    </dialog>
  );
}
