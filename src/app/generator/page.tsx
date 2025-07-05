"use client";

import { useState } from 'react';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GeneratedBlogData {
  title: string;
  metaDescription: string;
  body: string;
}

export default function Generator() {
  const [urls, setUrls] = useState({
    yourWebsite: '',
    competitorWebsite: '',
  });
  const [productNames, setProductNames] = useState({
    userProduct: '',
    competitorProduct: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedBlogData, setGeneratedBlogData] = useState<GeneratedBlogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedBlogData(null);
    setCopied(false);

    try {
      const { userProduct: userProductName, competitorProduct: competitorName } = productNames;

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...urls,
          userProductName,
          competitorName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: GeneratedBlogData = await response.json();
      setGeneratedBlogData(data);

    } catch (err: any) {
      console.error('Error generating blog:', err);
      setError(err.message || 'Failed to generate blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedBlogData?.body) {
      navigator.clipboard.writeText(`${generatedBlogData.title}\n\n${generatedBlogData.metaDescription}\n\n${generatedBlogData.body}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setError('Failed to copy text.');
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-50 text-gray-800">
      <header className="w-full flex justify-center items-center py-4 border-b border-gray-200 bg-white">
        <Image src="/logo.png" alt="Piggyback Logo" width={90} height={90} />
      </header>
      <main className="flex flex-col items-center w-full max-w-4xl px-4 sm:px-8 py-12 bg-white rounded-lg shadow-xl my-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Ride Their Wave
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          <div>
            <label htmlFor="userProduct" className="block text-sm font-medium text-gray-600 mb-2">
              Your Product Name
            </label>
            <input
              type="text"
              id="userProduct"
              value={productNames.userProduct}
              onChange={(e) => setProductNames({ ...productNames, userProduct: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#043d58] focus:border-[#043d58] text-gray-900 text-base"
              placeholder="e.g., Apollo.io"
              required
            />
          </div>
          <div>
            <label htmlFor="competitorProduct" className="block text-sm font-medium text-gray-600 mb-2">
              Competitor Product Name
            </label>
            <input
              type="text"
              id="competitorProduct"
              value={productNames.competitorProduct}
              onChange={(e) => setProductNames({ ...productNames, competitorProduct: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#043d58] focus:border-[#043d58] text-gray-900 text-base"
              placeholder="e.g., Seamless AI"
              required
            />
          </div>
          <div>
            <label htmlFor="yourWebsite" className="block text-sm font-medium text-gray-600 mb-2">
              Your Website URL
            </label>
            <input
              type="url"
              id="yourWebsite"
              value={urls.yourWebsite}
              onChange={(e) => setUrls({ ...urls, yourWebsite: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#043d58] focus:border-[#043d58] text-gray-900 text-base"
              placeholder="e.g., https://yourproduct.com"
              required
            />
          </div>
          <div>
            <label htmlFor="competitorWebsite" className="block text-sm font-medium text-gray-600 mb-2">
              Competitor Website URL
            </label>
            <input
              type="url"
              id="competitorWebsite"
              value={urls.competitorWebsite}
              onChange={(e) => setUrls({ ...urls, competitorWebsite: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#043d58] focus:border-[#043d58] text-gray-900 text-base"
              placeholder="e.g., https://competitor.com/platform-overview"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-lg font-semibold transition-all duration-300
              ${loading
                ? 'bg-[#043d58] text-white cursor-not-allowed flex items-center justify-center'
                : 'bg-[#043d58] hover:bg-[#032a3d] text-white focus:outline-none focus:ring-2 focus:ring-[#043d58] focus:ring-offset-2'
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Blog Post'
            )}
          </button>
        </form>
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {generatedBlogData && (
          <div className="mt-12 p-8 bg-gray-50 rounded-lg shadow-inner w-full text-gray-800 relative">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-8 break-words">{generatedBlogData.title}</h2>
            {generatedBlogData.metaDescription && (
              <p className="text-gray-600 mb-12 italic text-xl">{generatedBlogData.metaDescription}</p>
            )}
            <div className="prose prose-xl max-w-none text-gray-800 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {generatedBlogData.body}
              </ReactMarkdown>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 px-6 py-2 bg-[#043d58] text-white rounded-md font-semibold hover:bg-[#032a3d] transition"
            >
              {copied ? 'Copied!' : 'Copy Blog Post'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 