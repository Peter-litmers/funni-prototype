/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4f8",
          100: "#fce3ec",
          500: "#e85d93",
          700: "#c43c74"
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          400: "#9ca3af",
          500: "#6b7280",
          700: "#374151",
          900: "#111827"
        },
        success: {
          50: "#ecfdf5",
          500: "#10b981"
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b"
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444"
        }
      },
      borderRadius: {
        xl: "20px"
      },
      boxShadow: {
        card: "0 8px 20px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};
