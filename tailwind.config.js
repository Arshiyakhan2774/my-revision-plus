
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      boxShadow: {
        'myShadow': '-1px 0px 5px 2.5px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'primary-gradient': "linear-gradient(90deg, rgb(1, 0, 104) 0%, rgb(1, 0, 172) 100%)",
      },
      colors: {
          'custom-primary': '#e8f0fe', 
           secondary: "rgb(1, 0, 104)", 
      },
      
    },
  },
  plugins: [],
}

