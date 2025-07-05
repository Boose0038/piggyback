# AI Blog Generator

An AI-powered web application that automatically generates SEO-optimized blog posts by analyzing your website and competitor websites.

## Features

- Web scraping using Firecrawl API
- AI-powered content generation using Google's Gemini API
- SEO-optimized blog post generation
- Modern, responsive UI built with Next.js and Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- Firecrawl API key
- Google Gemini API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your website URL
2. Enter a competitor's website URL
3. Click "Generate Blog Post"
4. Wait for the AI to analyze both websites and generate a blog post
5. Review and copy the generated content

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Google Gemini API
- Firecrawl API
- Axios

## License

MIT
