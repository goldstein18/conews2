'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { NewsHeader } from '@/app/news/components';
import {
  INDUSTRY_NEWS_HEADER_CATEGORIES,
  INDUSTRY_CATEGORY_DESCRIPTIONS,
  INDUSTRY_CATEGORY_TOPICS
} from '@/app/industry-news/constants';

export default function IndustryNewsCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;

  const currentCategory = INDUSTRY_NEWS_HEADER_CATEGORIES.find(
    (category) => category.slug === categoryParam || category.id === categoryParam
  );

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === currentCategory?.id) return;
    router.push(`/industry-news/category/${categoryId}`);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-white">
        <NewsHeader
          selectedCategory={undefined}
          onCategoryChange={() => {}}
          categories={INDUSTRY_NEWS_HEADER_CATEGORIES}
          showIndustryButton={false}
          viewMode="industry"
        />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg font-semibold">Category not found.</p>
          <Link href="/industry-news" className="mt-4 inline-flex rounded-full border border-[#3d98d3] px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#3d98d3]">
            Back to Industry News
          </Link>
        </div>
      </div>
    );
  }

  const description =
    INDUSTRY_CATEGORY_DESCRIPTIONS[currentCategory.id] ||
    `Discover the latest stories in ${currentCategory.name}.`;
  const otherCategories = INDUSTRY_NEWS_HEADER_CATEGORIES.filter(
    (category) => category.id !== currentCategory.id
  );

  return (
    <div className="min-h-screen bg-white">
      <NewsHeader
        selectedCategory={currentCategory.id}
        onCategoryChange={handleCategoryChange}
        categories={INDUSTRY_NEWS_HEADER_CATEGORIES}
        showIndustryButton={false}
        viewMode="industry"
      />
      <main className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,80%)_minmax(0,20%)] items-start">
          <section className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-[0.2em] uppercase text-[#111]">
              {currentCategory.name}
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">{description}</p>
            <div className="h-[400px] rounded-2xl border border-dashed border-gray-300" aria-hidden />
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                Topics
              </h2>
              {INDUSTRY_CATEGORY_TOPICS[currentCategory.id] && (
                <>
                  <p className="mt-3 text-sm text-gray-600">
                    {INDUSTRY_CATEGORY_TOPICS[currentCategory.id].intro}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    {INDUSTRY_CATEGORY_TOPICS[currentCategory.id].topics.map((topic) => (
                      <div key={topic.title}>
                        <p className="text-sm font-semibold text-gray-900">{topic.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{topic.detail}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                Explore Other Categories
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {otherCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/industry-news/category/${category.id}`}
                      className="text-sm font-semibold text-[#3d98d3] hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

