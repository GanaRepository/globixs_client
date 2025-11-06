//tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        'sans': ['var(--font-work-sans)', 'var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'Georgia', 'serif'],
        'heading': ['var(--font-playfair)', 'Georgia', 'serif'],
        'body': ['var(--font-work-sans)', 'system-ui', 'sans-serif'],
        'modern': ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Contact color palette
        contact: {
          purple: {
            light: '#9b87f5',
            DEFAULT: '#7E69AB',
            dark: '#6E59A5',
          },
          teal: {
            light: '#84e6d9',
            DEFAULT: '#33C3F0',
            dark: '#20a7d3',
          },
          bg: '#F6F9FC',
          'card-bg': 'rgba(255, 255, 255, 0.8)',
        },

        // Globixs Brand Color Palette - Updated Professional Theme
        globixs: {
          // Primary colors (inspired by modern professional themes)
          primary: '#1e3a8a', // Deep blue (professional navy)
          secondary: '#0ea5e9', // Bright sky blue
          accent: '#f97316', // Orange accent (for CTAs and highlights)

          // Alternative themes (comment/uncomment as needed)
          // Red theme option
          // primary: '#dc2626', // Professional red
          // secondary: '#ef4444', // Bright red
          // accent: '#fbbf24', // Yellow accent

          // UI colors
          dark: '#0f172a', // Very dark navy (for headers, text)
          medium: '#334155', // Medium slate
          light: '#f8fafc', // Clean white-blue

          // Background colors
          bgDark: '#0f172a', // Very dark navy background
          bgLight: '#f8fafc', // Clean white-blue background
          bgAccent: '#eff6ff', // Light blue background for sections
          bgGradient: '#1e40af', // Gradient blue

          // Text colors
          text: '#1e293b', // Dark professional text
          textLight: '#64748b', // Light professional text
          textOnDark: '#f8fafc', // Light text on dark backgrounds
          textMuted: '#94a3b8', // Muted text for captions

          // Professional accent colors
          success: '#059669', // Professional green
          warning: '#d97706', // Professional orange-yellow
          error: '#dc2626', // Professional red
          info: '#2563eb', // Professional blue

          // Card and surface colors
          surface: '#ffffff', // Pure white for cards
          surfaceHover: '#f1f5f9', // Light hover state
          border: '#e2e8f0', // Light borders
          borderHover: '#cbd5e1', // Hover borders
        },

        // System colors for shadcn/ui
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
          primary: 'hsl(var(--sidebar-primary) / <alpha-value>)',
          'primary-foreground':
            'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
          accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground':
            'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border) / <alpha-value>)',
          ring: 'hsl(var(--sidebar-ring) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'zoom-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'pulse-gentle': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.85',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        blob: 'blob 7s infinite',
        'gradient-x': 'gradient-x 10s ease infinite',
      },
      backgroundSize: {
        '300%': '300%',
      },
      boxShadow: {
        floating:
          '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'card-hover':
          '0 15px 30px -5px rgba(0, 0, 0, 0.07), 0 10px 15px -5px rgba(0, 0, 0, 0.03)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
