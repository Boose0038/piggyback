import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FirecrawlApp from '@mendable/firecrawl-js';

// Initialize Gemini with the API key directly
const genAI = new GoogleGenerativeAI('AIzaSyAaM6uhZ0XKWTN9VyJ6S8GLzfmjgmTF65c');

// Initialize Firecrawl with the API key in the correct format
const firecrawl = new FirecrawlApp({
  apiKey: 'fc-5be2fad3fd4346ccbb4b4e06447aa29a'
});

async function scrapeWebsite(url: string) {
  try {
    const crawlResult = await firecrawl.crawlUrl(url, {
      limit: 10,
      scrapeOptions: {
        formats: ["markdown"],
        onlyMainContent: true
      }
    });
    return crawlResult;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { yourWebsite, competitorWebsite } = await request.json();

    // Scrape both websites
    const [yourSiteData, competitorSiteData] = await Promise.all([
      scrapeWebsite(yourWebsite),
      scrapeWebsite(competitorWebsite),
    ]);

    // Prepare the prompt for Gemini
    const prompt = `
      Create an SEO-optimized blog post comparing the features and benefits of these two websites:
      
      Your Website (${yourWebsite}):
      ${JSON.stringify(yourSiteData, null, 2)}
      
      Competitor Website (${competitorWebsite}):
      ${JSON.stringify(competitorSiteData, null, 2)}
      
      Please create a blog post that:
      1. Highlights the unique features and benefits of both websites
      2. Uses SEO-friendly language and keywords
      3. Is informative and engaging
      4. Has a clear structure with headings and subheadings
      5. Is approximately 1000 words long
      6. Includes a compelling title
    `;

    // Generate the blog post using Gemini with the correct model and format
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const blog = result.response.text();

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error generating blog:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
} 