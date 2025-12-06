/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "#F9FAFB", // Page Background
                foreground: "#111827", // Text Primary
                primary: {
                    DEFAULT: "#1F3A5F", // Navbar & Primary Buttons
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#C9A227", // Secondary Buttons
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "#DC2626", // Danger Buttons
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#F3F4F6",
                    foreground: "#4B5563", // Text Muted
                },
                accent: {
                    DEFAULT: "#f1f5f9",
                    foreground: "#0f172a",
                },
                popover: {
                    DEFAULT: "#FFFFFF", // Card Backgrounds
                    foreground: "#111827",
                },
                card: {
                    DEFAULT: "#FFFFFF", // Card Backgrounds
                    foreground: "#111827",
                },
                sidebar: {
                    DEFAULT: "#FFFFFF", // Sidebar
                    foreground: "#111827",
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
