'use client';

import { Share2, Facebook, Twitter, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareText = description ? `${title} - ${description}` : title;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled share - no action needed
        // Silently handle cancellation
      }
    }
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      // Try alternative method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        // Silent fail - user can manually copy if needed
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {navigator.share && (
        <button
          onClick={handleShare}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Share"
          title="Share"
        >
          <Share2 size={18} className="text-gray-600" />
        </button>
      )}
      <button
        onClick={shareToFacebook}
        className="p-2 rounded-md hover:bg-blue-50 transition-colors"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook size={18} className="text-blue-600" />
      </button>
      <button
        onClick={shareToTwitter}
        className="p-2 rounded-md hover:bg-blue-50 transition-colors"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <Twitter size={18} className="text-blue-400" />
      </button>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <Copy size={18} className="text-gray-600" />
        )}
      </button>
    </div>
  );
}
