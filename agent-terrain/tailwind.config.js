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
        surface: "#f8f9fa",
        "on-surface": "#191c1d",
        "on-surface-variant": "#3d4a41",
        "surface-container-low": "#f3f4f5",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        outline: "#6d7a70",
        "outline-variant": "#bccabe",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
