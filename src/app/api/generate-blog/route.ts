import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FirecrawlApp from '@mendable/firecrawl-js';
import fs from 'fs/promises'; // Required for fs.writeFile (though not used in this snippet)
import path from 'path';     // Required for path.join (though not used in this snippet)

// --- Environment Variable Check ---
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}
if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error('FIRECRAWL_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// --- YOUR DETAILED SYSTEM PROMPT TEMPLATE (from above) ---
const DETAILED_SYSTEM_PROMPT_TEMPLATE = `You are a SaaS content strategist and insightful tech writer, skilled in creating educational and thought-leadership articles that analyze industry tools and approaches. Your style should be similar to influential tech blogs that prioritize clarity, expert insight, and engaging explanations (e.g., the Voiceflow blog).

Your task is to write a comprehensive, SEO-optimized blog post that introduces and explains "{{competitorName}}". The post should analyze its approach to solving a core problem and then thoughtfully position "{{userProductName}}" as offering a distinct, valuable, and intelligent alternative. The goal is to create a "thoughtful alternative" piece, not an aggressive "vs." article.

The content will be based strictly on the detailed information provided:
User Product Name: {{userProductName}}
User Product Description: {{userProductMarkdownContent}} (This includes the description and key benefits of {{userProductName}.)
User Product URL: {{userProductURL}}
Competitor Product Name: {{competitorName}} (This should be derived from the scraped competitor content.)
Competitor Product Description: {{competitorMarkdownContent}} (This is the content scraped from the competitor's website.)

From the provided content for both products, you MUST infer the common "problem space" they operate in and the likely "targetAudience" (e.g., "sales teams," "enterprise developers," "small business owners").

The blog post MUST follow this structure. **Output the entire blog post as a single, coherent Markdown string. Do NOT use any JSON formatting or code blocks.**

1.  **Blog Title:**
    * Create an engaging blog title that frames the article as an analysis or exploration. It should include "{{competitorName}}" and hint at a new perspective offered by "{{userProductName}}". Examples: "Understanding the {{competitorName}} Approach to [Problem Space]", "A New Perspective on [Problem Space]: Exploring {{competitorName}} and the {{userProductName}} Method". Avoid using "vs.".
    * **Place this title as the very first line of the output, formatted as an H1 Markdown heading (e.g., \`# Your Blog Title\` )**

2.  **SEO Meta Description:**
    * Write a concise SEO meta description (150-160 characters) that summarizes the article's focus on analyzing "{{competitorName}}"'s approach and introducing "{{userProductName}}"'s distinct solution.
    * **Place this meta description immediately after the H1 title, as plain text, followed by a double newline to separate it from the introduction.**

3.  **Introduction:**
    * **Start the introduction with an engaging 'hook'** – a compelling question, a surprising statistic, or a relatable statement about the challenges the \`targetAudience\` faces in the 'problem space'. This opening paragraph should draw the reader in.
    * After the hook, smoothly transition into acknowledging \`{{competitorName}}\` as a notable tool and clearly state the article's aim: to explore its approach and then present the different, compelling methodology offered by \`{{userProductName}}\`.
    * **Crucially, this introduction must be a distinct narrative opening and should NOT be a repetition or slight reformatting of the meta description.**

4.  **Understanding the {{competitorName}} Approach (Body - Part 1: The Explanation):**
    * **Format as an H2 Markdown heading.**
    * Provide a clear, objective, and detailed explanation of what "{{competitorName}}" is and how it works, based on its provided content.
    * Describe its key features, core philosophy, and intended workflow for the inferred target audience. This section should be fair and informative, positioning you as a knowledgeable expert. Use H3 Markdown headings for sub-sections within this part if appropriate.

5.  **The {{userProductName}} Perspective: A Different Approach (Body - Part 2: Strategic Positioning):**
    * **Format as an H2 Markdown heading.**
    * This is the section for strategic differentiation. Transition smoothly from explaining the competitor to introducing your product.
    * Articulate "{{userProductName}}"'s distinct value proposition and unique methodology for solving the same core problem.
    * Highlight key philosophies or features from {{userProductMarkdownContent}} that contrast with the competitor's approach. Explain *why* your approach is effective and beneficial for a certain type of user within the target audience.
    * Focus on positive differentiation ("While many tools focus on X, {{userProductName}} is designed around the principle of Y, which leads to...") rather than direct, negative comparisons ("{{competitorName}}'s Feature A is worse than ours").

6.  **Choosing Your Approach (Conclusion):**
    * **Format as an H2 Markdown heading.**
    * Briefly summarize the two different philosophies or approaches presented (that of "{{competitorName}}" and that of "{{userProductName}}").
    * Frame the choice not as "which product is better," but as "which approach is right for you."
    * Conclude with a strong, outcome-driven recommendation. Frame the final sentences around the tangible benefits and successful outcomes the inferred \`targetAudience\` can achieve with \`{{userProductName}}\`. Instead of just stating that your product 'is a powerful solution,' connect it directly to the reader's goals (e.g., 'For teams ready to shorten sales cycles and close more deals with verified data, \`{{userProductName}\`'s platform is built for that mission.'). This final paragraph should be persuasive and action-oriented.
    * **Note:** The AI will now *not* include any specific CTA link in its output. The user will be responsible for adding this manually after the content is generated.

Additional Guidelines:
* **Tone:** The tone should be expert, analytical, insightful, and helpful. When discussing the competitor, it should be objective and respectful. When discussing "{{userProductName}}", the tone should be confident and clear, articulating its value as a thoughtful and distinct alternative. The overall feel should be one of trusted, strategic guidance.
* **SEO:** Keywords should focus on the "problem space", "{{competitorName}}", "{{competitorName}} alternatives", "{{userProductName}}", and the benefits of each approach. Ensure these keywords are naturally integrated throughout the content.
* **Linking/CTAs:** Strictly no promotional links or calls-to-action for the competitor within the main body. The AI should not generate any links in the conclusion.
* **Markdown Formatting:** Use clear Markdown for headings (H1, H2, H3), lists, bolding, italics, etc., to make the text easily readable and formatted.

**Do NOT respond in JSON format. Provide the full blog post as a single, ready-to-copy Markdown string.**
`;

// --- NEW: Helper function to clean content ---
const cleanContent = (content: string): string => {
  // Regex to match common URL patterns (http/https and www. patterns)
  // and replace them with an empty string.
  // This is a basic cleaner; for robust production, consider a more sophisticated library
  // or a more precise regex if you need to preserve some specific URLs.
  let cleaned = content.replace(/(https?:\/\/[^\s]+)/g, ''); // Removes http/https URLs
  cleaned = cleaned.replace(/(www\.[^\s]+)/g, ''); // Removes www. URLs
  // You might also want to strip specific HTML tags that Firecrawl might leave if not desired
  // cleaned = cleaned.replace(/<\/?(div|span|p|a|ul|li)[^>]*>/g, ''); // Example: remove common HTML tags
  return cleaned.trim(); // Trim any leading/trailing whitespace left by replacements
};


async function scrapeWebsite(url: string) {
  try {
    const crawlResult = await firecrawl.crawlUrl(url, {
      limit: 1,
      scrapeOptions: {
        formats: ["markdown"],
      },
    });

    if (crawlResult.data && Array.isArray(crawlResult.data) && crawlResult.data.length > 0) {
      return crawlResult.data[0].content || '';
    }
    return '';
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log('API Route /api/generate-blog hit!');

  let yourWebsite: string;
  let competitorWebsite: string;
  let userProductName: string;
  let competitorName: string;

  try {
    const requestBody = await request.json();
    yourWebsite = requestBody.yourWebsite;
    competitorWebsite = requestBody.competitorWebsite;

    // These values now come directly from the frontend inputs (as updated in page.tsx)
    userProductName = requestBody.userProductName;
    competitorName = requestBody.competitorName;

  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid request body. Ensure "yourWebsite", "competitorWebsite", "userProductName", and "competitorName" are provided.' },
      { status: 400 }
    );
  }

  try {
    const [yourSiteRawMarkdownContent, competitorRawMarkdownContent] = await Promise.all([
      scrapeWebsite(yourWebsite),
      scrapeWebsite(competitorWebsite),
    ]);

    // --- APPLY CLEANING HERE to the scraped content ---
    const yourSiteMarkdownContent = cleanContent(yourSiteRawMarkdownContent);
    const competitorMarkdownContent = cleanContent(competitorRawMarkdownContent);

    // --- CRITICAL FIX: Removed JSON.stringify when injecting content ---
    // The prompt expects plain markdown strings, not JSON stringified versions.
    let finalPrompt = DETAILED_SYSTEM_PROMPT_TEMPLATE
      .replace(/{{competitorName}}/g, competitorName)
      .replace(/{{userProductName}}/g, userProductName)
      .replace(/{{userProductMarkdownContent}}/g, yourSiteMarkdownContent) // Use cleaned content
      .replace(/{{userProductURL}}/g, yourWebsite)
      .replace(/{{competitorMarkdownContent}}/g, competitorMarkdownContent); // Use cleaned content


    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(finalPrompt);

    let rawTextOutput = result.response.text(); // AI now returns raw text directly

    console.log('--- Raw AI Text Output (for Regex Parsing) ---');
    console.log(rawTextOutput);
    console.log('--- End Raw AI Text Output ---');

    // --- Parsing AI's raw output into structured title, metaDescription, and body ---
    let title = 'Generated Blog Post (Title Not Found)';
    let metaDescription = 'Meta description not found.';
    let body = rawTextOutput; // Default to full raw text if parsing fails

    try {
        // Regex to capture H1 title, then meta description, then the rest as body
        const blogStructureRegex = /^#\s*(.+?)\n\n(.+?)\n\n([\s\S]*)/m;
        const match = rawTextOutput.match(blogStructureRegex);

        if (match && match.length === 4) {
            title = match[1].trim();
            metaDescription = match[2].trim();
            body = match[3].trim();
        } else {
            console.warn('Could not parse structured blog components via regex. Attempting fallback for title and body.');
            // Fallback: just get the first H1 as title, and the rest as body
            const firstLineMatch = rawTextOutput.match(/^#\s*(.+?)\n/);
            if(firstLineMatch && firstLineMatch[1]) {
                title = firstLineMatch[1].trim();
                body = rawTextOutput.substring(rawTextOutput.indexOf(firstLineMatch[0]) + firstLineMatch[0].length).trim();
                // Try to extract meta description from the first few lines if possible
                const linesAfterTitle = body.split('\n');
                if (linesAfterTitle.length > 1 && linesAfterTitle[0].trim() !== '') {
                    metaDescription = linesAfterTitle[0].trim();
                    body = linesAfterTitle.slice(2).join('\n').trim(); // Skip meta and blank line after it
                }
            }
        }
    } catch (parseError) {
        console.error('Error parsing natural language blog structure (regex failed):', parseError);
        body = `Error parsing generated blog structure: ${(parseError as Error).message}\n\n${rawTextOutput}`;
    }

    return NextResponse.json({ title, metaDescription, body });

  } catch (error) {
    console.error('Error generating blog:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: (error as Error).message },
      { status: 500 }
    );
  }
}