'use client';

import { useState } from 'react';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#f7fafd] flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-6 bg-transparent">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Piggyback Logo" width={80} height={80} />
        </div>
        <nav className="hidden md:flex gap-8 items-center text-gray-700 font-medium">
          <a href="#features" className="hover:text-[#043d58] transition">Features</a>
          <a href="#pricing" className="hover:text-[#043d58] transition">Pricing</a>
          <button className="px-4 py-2 border rounded-md border-gray-300 hover:border-[#043d58] transition">Sign In</button>
          <Link href="/generator" className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-md font-semibold hover:bg-[#043d58] transition">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Ride the Search Traffic of <br />
          <span className="text-[#043d58]">Industry</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
          AI-powered content generation that helps smaller SaaS companies compete by leveraging the search traffic and content strategies of established market leaders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/generator" className="px-8 py-4 bg-[#043d58] text-white rounded-lg font-semibold text-lg shadow hover:bg-[#032a3d] transition">Try Now</Link>
          <button className="px-8 py-4 bg-white border border-gray-300 text-gray-900 rounded-lg font-semibold text-lg shadow hover:border-[#043d58] transition">Watch Demo</button>
        </div>
        <div className="flex gap-6 justify-center text-sm text-gray-500 mt-2">
          <span>✅ No credit card required</span>
          <span>✅ 14-day free trial</span>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl mx-auto py-20 px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">Your AI-Powered Content Strategy</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Piggyback analyzes your competitors' winning content and generates targeted content that captures their search traffic
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <div className="bg-[#043d58] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 text-2xl font-bold">🎯</div>
            <h3 className="text-xl font-bold mb-2">Competitor Analysis</h3>
            <p className="text-gray-600 text-center">Identify which content drives the most traffic for your competitors and uncover their keyword strategies</p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <div className="bg-[#043d58] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 text-2xl font-bold">⚡</div>
            <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
            <p className="text-gray-600 text-center">Generate high-quality, optimized content that targets the same keywords with your unique angle</p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <div className="bg-[#043d58] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 text-2xl font-bold">📈</div>
            <h3 className="text-xl font-bold mb-2">Traffic Capture</h3>
            <p className="text-gray-600 text-center">Capture search traffic that would otherwise go to competitors with strategic content positioning</p>
          </div>
        </div>
      </section>
    </div>
  );
}