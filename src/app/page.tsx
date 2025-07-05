'use client';

import { useState } from 'react';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Optional: For icon usage (you'd need to install a library like react-icons)
// import { FiCopy, FiGlobe, FiTarget } from 'react-icons/fi';

// Define a type for your blog data for better type safety
interface GeneratedBlogData {
  title: string;
  metaDescription: string;
  body: string;
}

export default function Home() {
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
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-gray-950 text-gray-50">
      <header className="w-full flex justify-between items-center py-4">
        {/* Updated App Header Title Color to match logo's deep blue/teal */}
        <h1 className="text-2xl font-bold text-blue-600">Piggyback</h1>
      </header>

      <main className="flex flex-col items-center w-full max-w-4xl px-4 py-8 bg-gray-800 rounded-lg shadow-xl mb-auto mt-8">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
          Ride Their Wave
        </h2>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          {/* Input Fields - Focus Ring Color Updated */}
          <div>
            <label htmlFor="userProduct" className="block text-sm font-medium text-gray-300 mb-2">
              Your Product Name
            </label>
            <input
              type="text"
              id="userProduct"
              value={productNames.userProduct}
              onChange={(e) => setProductNames({ ...productNames, userProduct: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white text-base"
              placeholder="e.g., Apollo.io"
              required
            />
          </div>

          <div>
            <label htmlFor="competitorProduct" className="block text-sm font-medium text-gray-300 mb-2">
              Competitor Product Name
            </label>
            <input
              type="text"
              id="competitorProduct"
              value={productNames.competitorProduct}
              onChange={(e) => setProductNames({ ...productNames, competitorProduct: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white text-base"
              placeholder="e.g., Seamless AI"
              required
            />
          </div>

          <div>
            <label htmlFor="yourWebsite" className="block text-sm font-medium text-gray-300 mb-2">
              Your Website URL
            </label>
            <input
              type="url"
              id="yourWebsite"
              value={urls.yourWebsite}
              onChange={(e) => setUrls({ ...urls, yourWebsite: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white text-base"
              placeholder="e.g., https://yourproduct.com"
              required
            />
          </div>

          <div>
            <label htmlFor="competitorWebsite" className="block text-sm font-medium text-gray-300 mb-2">
              Competitor Website URL
            </label>
            <input
              type="url"
              id="competitorWebsite"
              value={urls.competitorWebsite}
              onChange={(e) => setUrls({ ...urls, competitorWebsite: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white text-base"
              placeholder="e.g., https://competitor.com/platform-overview"
              required
            />
          </div>

          {/* Generate Button - Color Updated */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-lg font-semibold transition-all duration-300
              ${loading
                ? 'bg-blue-800 text-blue-200 cursor-not-allowed flex items-center justify-center'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-800' // Focus ring matches button
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

        {/* Display Errors */}
        {error && (
          <div className="mt-8 p-4 bg-red-800 border border-red-700 text-red-100 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Generated Blog Post Display */}
        {generatedBlogData && (
          <div className="mt-12 p-8 bg-gray-700 rounded-lg shadow-lg w-full text-gray-100 relative">
            <h2 className="text-5xl font-extrabold text-white mb-8 break-words">{generatedBlogData.title}</h2>
            {generatedBlogData.metaDescription && (
              <p className="text-gray-300 mb-12 italic text-xl">{generatedBlogData.metaDescription}</p>
            )}
            <div className="prose prose-xl prose-invert max-w-none text-gray-100 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {generatedBlogData.body}
              </ReactMarkdown>
            </div>

            {/* Action Buttons - Colors Updated to reflect scheme */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCopy}
                className={`py-3 px-6 rounded-md text-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${copied ? 'bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={() => setGeneratedBlogData(null)}
                className="py-3 px-6 rounded-md text-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
              >
                Generate New Post
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-wrap gap-6 items-center justify-center py-6 text-gray-400 text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-blue-600 hover:text-blue-500" // Links more prominent
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-blue-600 hover:text-blue-500" // Links more prominent
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-blue-600 hover:text-blue-500" // Links more prominent
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}