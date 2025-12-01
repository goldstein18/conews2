'use client';

import Link from 'next/link';
import { ChevronRight, Clock, ArrowUp, Share2 } from 'lucide-react';
import { NewsHeader } from '@/app/news/components';
import { useState, useEffect } from 'react';

export default function IArticlePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* News Header with Toggle */}
      <NewsHeader
        viewMode="cultural"
        showIndustryButton={false}
      />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              <Link
                href="/case-studies"
                className="hover:text-gray-900 transition-colors"
              >
                Case Studies
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-gray-900 font-medium">
                How XYZ Gallery Boosted Attendance by 40% with CultureOwl&apos;s SEO Tools
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="bg-[#E8F5E9] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Case Studies Label */}
              <div className="inline-block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3d98d3]">
                  CASE STUDIES
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                How XYZ Gallery Boosted Attendance by 40% with CultureOwl&apos;s SEO Tools
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                A comprehensive breakdown of how strategic SEO implementation transformed this gallery&apos;s online presence.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {['SEO', 'Gallery', 'Case Study', 'Digital Marketing'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Placeholder Icon */}
                <svg
                  className="w-24 h-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Author and Date Info */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Written by:</span> CultureOwl Editorial Team
                </p>
                <p>
                  <span className="font-medium">Updated:</span> 05/20/25 | <span className="font-medium">Published:</span> 05/15/25
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* The Challenge Section */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              The Challenge
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              XYZ Gallery, a contemporary art space in downtown Portland, had been operating for three years with minimal digital presence. Despite featuring emerging and established artists, their exhibitions were only reaching a small, local audience. Their website received fewer than 200 monthly visitors, and most attendees learned about events through word-of-mouth.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Key Metrics Before CultureOwl:
              </h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Monthly website visitors: 180</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Average exhibition attendance: 45 people</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Social media followers: 320</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Email subscribers: 85</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The Strategy Section */}
          <div className="space-y-6 pt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              The Strategy
            </h2>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Share this article
          </h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#1877F2' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166FE5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1877F2'}
              aria-label="Share on Facebook"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#FFFFFF' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('How XYZ Gallery Boosted Attendance by 40% with CultureOwl\'s SEO Tools')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#000000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              aria-label="Share on X"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#FFFFFF' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#0077B5' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006399'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0077B5'}
              aria-label="Share on LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#FFFFFF' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent('How XYZ Gallery Boosted Attendance by 40% with CultureOwl\'s SEO Tools')}%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#25D366' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20BA5A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
              aria-label="Share on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" style={{ fill: '#FFFFFF' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent('How XYZ Gallery Boosted Attendance by 40% with CultureOwl\'s SEO Tools')}&body=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#4B5563' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
              aria-label="Share via Email"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#FFFFFF' }}>
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#4B5563' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
              aria-label="Copy link"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#FFFFFF' }}>
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            YOU MIGHT ALSO LIKE THESE
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article Card 1 */}
            <Link href="/iarticle" className="group block">
              <article className="space-y-4">
                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Category and Read Time */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#3d98d3] text-white text-xs font-semibold uppercase tracking-wide">
                    CASE STUDIES
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>7 min read</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-[#3d98d3] group-hover:underline">
                  Modern Art Gallery&apos;s Membership Retention Strategy
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  Learn how this gallery achieved a 92% renewal rate through strategic engagement.
                </p>
              </article>
            </Link>

            {/* Article Card 2 */}
            <Link href="/iarticle" className="group block">
              <article className="space-y-4">
                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Category and Read Time */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#3d98d3] text-white text-xs font-semibold uppercase tracking-wide">
                    CASE STUDIES
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>10 min read</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-[#3d98d3] group-hover:underline">
                  From Local to National: How Riverside Arts Festival Scaled
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  The growth strategy that transformed a community event into a national attraction.
                </p>
              </article>
            </Link>

            {/* Article Card 3 */}
            <Link href="/iarticle" className="group block">
              <article className="space-y-4">
                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Category and Read Time */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#3d98d3] text-white text-xs font-semibold uppercase tracking-wide">
                    CASE STUDIES
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>8 min read</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-[#3d98d3] group-hover:underline">
                  Community Theater Triples Audience in 18 Months
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  Strategic marketing and programming decisions that led to exponential growth.
                </p>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

// Scroll to Top Button Component
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-[#3d98d3] text-white rounded-lg shadow-lg hover:bg-[#2b85ba] transition-colors flex items-center justify-center z-50"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

