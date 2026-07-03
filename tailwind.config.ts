import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))"
        }
      },
      boxShadow: {
        card: "0 4px 16px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.08)",
        dropdown: "0 10px 30px rgba(0, 0, 0, 0.08)",
        soft: "0 4px 16px rgba(0, 0, 0, 0.05)" // map soft to card shadow to avoid breaking existing usages
      },
      borderRadius: {
        button: "8px",
        card: "10px",
        input: "8px",
        dialog: "12px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px"
      }
    }
  },
  plugins: []
};

export default config;
