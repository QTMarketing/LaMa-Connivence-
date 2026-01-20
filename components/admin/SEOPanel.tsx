'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle, XCircle, AlertTriangle,
  Eye, EyeOff, Link as LinkIcon, Image as ImageIcon,
  BarChart3, FileText, Share2, Settings, Globe
} from 'lucide-react';

interface SEOData {
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType?: string;
}

interface SEOPanelProps {
  data: SEOData;
  onChange: (data: SEOData) => void;
  title?: string;
  content?: string;
  slug?: string;
}

export default function SEOPanel({ data, onChange, title, content, slug }: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'advanced' | 'schema'>('general');
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState<{ name: string; passed: boolean; message?: string }[]>([]);

  // Calculate SEO Score (RankMath style)
  useEffect(() => {
    const checks: { name: string; passed: boolean; message?: string }[] = [];
    let score = 0;

    // Title checks
    if (data.seoTitle) {
      const titleLength = data.seoTitle.length;
      if (titleLength >= 30 && titleLength <= 60) {
        score += 15;
        checks.push({ name: 'SEO Title length', passed: true, message: `${titleLength} characters` });
      } else {
        checks.push({ 
          name: 'SEO Title length', 
          passed: false, 
          message: `${titleLength} characters (recommended: 30-60)` 
        });
      }
      
      if (data.focusKeyword && data.seoTitle.toLowerCase().includes(data.focusKeyword.toLowerCase())) {
        score += 10;
        checks.push({ name: 'Focus keyword in title', passed: true });
      } else if (data.focusKeyword) {
        checks.push({ name: 'Focus keyword in title', passed: false });
      }
    } else {
      checks.push({ name: 'SEO Title', passed: false, message: 'Missing SEO title' });
    }

    // Description checks
    if (data.seoDescription) {
      const descLength = data.seoDescription.length;
      if (descLength >= 120 && descLength <= 160) {
        score += 15;
        checks.push({ name: 'Meta description length', passed: true, message: `${descLength} characters` });
      } else {
        checks.push({ 
          name: 'Meta description length', 
          passed: false, 
          message: `${descLength} characters (recommended: 120-160)` 
        });
      }
      
      if (data.focusKeyword && data.seoDescription.toLowerCase().includes(data.focusKeyword.toLowerCase())) {
        score += 10;
        checks.push({ name: 'Focus keyword in description', passed: true });
      } else if (data.focusKeyword) {
        checks.push({ name: 'Focus keyword in description', passed: false });
      }
    } else {
      checks.push({ name: 'Meta description', passed: false, message: 'Missing meta description' });
    }

    // Focus keyword
    if (data.focusKeyword) {
      score += 10;
      checks.push({ name: 'Focus keyword set', passed: true });
    } else {
      checks.push({ name: 'Focus keyword', passed: false, message: 'No focus keyword set' });
    }

    // Content checks
    if (content && data.focusKeyword) {
      const keywordCount = (content.toLowerCase().match(new RegExp(data.focusKeyword.toLowerCase(), 'g')) || []).length;
      if (keywordCount >= 1) {
        score += 10;
        checks.push({ name: 'Focus keyword in content', passed: true, message: `Found ${keywordCount} times` });
      } else {
        checks.push({ name: 'Focus keyword in content', passed: false, message: 'Keyword not found in content' });
      }
    }

    // Image checks
    if (data.ogImage) {
      score += 10;
      checks.push({ name: 'Social image', passed: true });
    } else {
      checks.push({ name: 'Social image', passed: false, message: 'No social image set' });
    }

    // Canonical URL
    if (data.canonicalUrl) {
      score += 5;
      checks.push({ name: 'Canonical URL', passed: true });
    } else {
      checks.push({ name: 'Canonical URL', passed: false, message: 'Optional but recommended' });
    }

    // Social media
    if (data.ogTitle && data.ogDescription) {
      score += 10;
      checks.push({ name: 'Open Graph data', passed: true });
    } else {
      checks.push({ name: 'Open Graph data', passed: false, message: 'Missing OG title or description' });
    }

    // Title in content
    if (title && content && content.toLowerCase().includes(title.toLowerCase())) {
      score += 5;
      checks.push({ name: 'Title in content', passed: true });
    }

    setSeoScore(Math.min(100, score));
    setSeoChecks(checks);
  }, [data, content, title]);

  // Calculate Readability Score
  useEffect(() => {
    if (!content) {
      setReadabilityScore(0);
      return;
    }

    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\n/).filter(p => p.trim().length > 0).length;
    
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const avgSentencesPerParagraph = paragraphs > 0 ? sentences / paragraphs : 0;

    let score = 100;
    
    // Penalize very long sentences
    if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;
    
    // Penalize very long paragraphs
    if (avgSentencesPerParagraph > 5) score -= 15;
    else if (avgSentencesPerParagraph > 3) score -= 5;
    
    // Reward good structure
    if (paragraphs >= 3) score += 10;
    if (words >= 300) score += 10;

    setReadabilityScore(Math.max(0, Math.min(100, score)));
  }, [content]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const updateData = (updates: Partial<SEOData>) => {
    onChange({ ...data, ...updates });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Score Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <TrendingUp size={20} className="text-blue-600" />
            RankMath SEO
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
                {seoScore}
              </div>
              <div className="text-xs text-gray-500">SEO Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(readabilityScore)}`}>
                {readabilityScore}
              </div>
              <div className="text-xs text-gray-500">Readability</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>SEO Score</span>
              <span>{seoScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${getScoreBg(seoScore)}`}
                style={{ width: `${seoScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Readability</span>
              <span>{readabilityScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${getScoreBg(readabilityScore)}`}
                style={{ width: `${readabilityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex">
        {[
          { id: 'general', label: 'General', icon: FileText },
          { id: 'social', label: 'Social', icon: Share2 },
          { id: 'advanced', label: 'Advanced', icon: Settings },
          { id: 'schema', label: 'Schema', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Keyword
              </label>
              <input
                type="text"
                value={data.focusKeyword || ''}
                onChange={(e) => updateData({ focusKeyword: e.target.value })}
                placeholder="e.g., convenience store"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">The focus keyword for this post</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={data.seoTitle || ''}
                onChange={(e) => updateData({ seoTitle: e.target.value })}
                placeholder="SEO optimized title (30-60 characters)"
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Recommended: 30-60 characters</span>
                <span className={data.seoTitle && data.seoTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}>
                  {data.seoTitle?.length || 0}/60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={data.seoDescription || ''}
                onChange={(e) => updateData({ seoDescription: e.target.value })}
                placeholder="SEO meta description (120-160 characters)"
                maxLength={160}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Recommended: 120-160 characters</span>
                <span className={data.seoDescription && (data.seoDescription.length < 120 || data.seoDescription.length > 160) ? 'text-red-600' : 'text-gray-500'}>
                  {data.seoDescription?.length || 0}/160
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={data.canonicalUrl || ''}
                onChange={(e) => updateData({ canonicalUrl: e.target.value })}
                placeholder="https://example.com/canonical-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SEO Checks */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">SEO Analysis</h4>
              <div className="space-y-2">
                {seoChecks.map((check, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {check.passed ? (
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={check.passed ? 'text-gray-700' : 'text-gray-600'}>
                        {check.name}
                      </span>
                      {check.message && (
                        <span className="text-gray-500 text-xs ml-2">({check.message})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Share2 size={16} />
                Open Graph (Facebook)
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={data.ogTitle || ''}
                    onChange={(e) => updateData({ ogTitle: e.target.value })}
                    placeholder="Open Graph title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Description
                  </label>
                  <textarea
                    value={data.ogDescription || ''}
                    onChange={(e) => updateData({ ogDescription: e.target.value })}
                    placeholder="Open Graph description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={data.ogImage || ''}
                    onChange={(e) => updateData({ ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Share2 size={16} />
                Twitter Card
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={data.twitterTitle || ''}
                    onChange={(e) => updateData({ twitterTitle: e.target.value })}
                    placeholder="Twitter card title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    value={data.twitterDescription || ''}
                    onChange={(e) => updateData({ twitterDescription: e.target.value })}
                    placeholder="Twitter card description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Image URL
                  </label>
                  <input
                    type="url"
                    value={data.twitterImage || ''}
                    onChange={(e) => updateData({ twitterImage: e.target.value })}
                    placeholder="https://example.com/twitter-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Settings size={16} />
                Robots Meta
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.robotsIndex}
                    onChange={(e) => updateData({ robotsIndex: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Index this page</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.robotsFollow}
                    onChange={(e) => updateData({ robotsFollow: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Follow links on this page</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.robotsNoArchive}
                    onChange={(e) => updateData({ robotsNoArchive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No Archive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.robotsNoSnippet}
                    onChange={(e) => updateData({ robotsNoSnippet: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No Snippet</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schema Type
              </label>
              <select
                value={data.schemaType || ''}
                onChange={(e) => updateData({ schemaType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="Article">Article</option>
                <option value="BlogPosting">Blog Posting</option>
                <option value="NewsArticle">News Article</option>
                <option value="WebPage">Web Page</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select schema type for structured data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
