/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#2563eb",
          secondary: "#8b5cf6",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444"
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }