/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs',
            './views/partials*.ejs'],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px'
      }
    },
    extend:{
      backgroundImage:{
        'chilies': "url('../public/imgs/login/chilies.jpg')"
      }
    } 
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["light", "winter"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "light",
  },
}
