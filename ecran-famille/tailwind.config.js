/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#006a40",
        "primary-container": "#008653",
        secondary: "#705d00",
        "secondary-container": "#fcd400",
        surface: "#FAFAFA",
        "on-surface": "#191c1d",
        "on-surface-variant": "#3d4a41",
        "surface-container-low": "#f3f4f5",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        outline: "#6d7a70",
        "outline-variant": "#EFEFEF",
        "accent-light": "#EAF3EE",
        "muted-label": "#9eaaa1",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },
      boxShadow: {
        'ambient': '0 24px 48px -12px rgba(26, 28, 28, 0.08)',
        'soft': '0 8px 16px -4px rgba(26, 28, 28, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
