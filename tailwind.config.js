/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Base styles for `prose` if needed, but `xl` overrides most of it for this use case
          },
        },
        xl: { // Styles specifically for 'prose-xl'
          css: {
            // --- H2 (Main Section Headers in the Markdown body) ---
            h2: {
              marginTop: '4em', // **Increased: More space above H2s for distinct sections**
              marginBottom: '1.5em', // **Increased: More space below H2s, creating separation from content**
              color: theme('colors.gray.50'), // **Changed: White/near-white for a cleaner look**
              fontWeight: '800', // **Set to extra bold**
              fontSize: theme('fontSize.5xl'), // **Increased: Very large font size for strong header presence**
              lineHeight: '1.2', // Tighter line height for large headers
            },
            // --- H3 (Sub-Headers in the Markdown body) ---
            h3: {
              marginTop: '2.5em', // **Increased: More space above H3s**
              marginBottom: '1em', // **Increased: More space below H3s**
              color: theme('colors.gray.100'), // Slightly off-white
              fontWeight: '700', // Bold
              fontSize: theme('fontSize.3xl'), // **Increased: Larger font size for sub-headers**
              lineHeight: '1.3',
            },
            // --- Paragraphs (Content) ---
            p: {
              marginBottom: '1.5em', // **Increased: More space between paragraphs for readability**
              lineHeight: '1.8', // Relaxed line height
              // font-size for p is implicitly handled by `prose-xl` to be smaller than h2/h3
              // Default prose-xl p size is ~18px, which will look noticeably smaller than 5xl and 3xl headers.
            },
            // --- Lists (adjusting for better spacing) ---
            ul: {
              marginBottom: '1.5em',
              li: {
                marginBottom: '0.5em',
              }
            },
            ol: {
              marginBottom: '1.5em',
              li: {
                marginBottom: '0.5em',
              }
            },
            // Ensuring strong/b/i tags are distinct in dark mode
            strong: {
                color: theme('colors.white'),
            },
            em: {
                color: theme('colors.gray.300'),
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};