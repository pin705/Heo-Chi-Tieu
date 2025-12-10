module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "var(--zmp-primary-color)",
        primaryForeground: "var(--primaryForeground)",
        foreground: "var(--foreground)",
        background: "var(--background)",
        section: "var(--section)",
        inactive: "var(--inactive)",
        subtitle: "var(--subtitle)",
        skeleton: "var(--skeleton)",
        gray: "#767A7F",
        divider: "#E9EBED",
        green: "#288F4E",
        yellow: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        // Dark mode colors
        dark: {
          primary: '#42A5F5',
          background: '#121212',
          surface: '#1E1E1E',
          surfaceVariant: '#2C2C2C',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
          border: '#333333',
        }
      },
    },
  },
};
