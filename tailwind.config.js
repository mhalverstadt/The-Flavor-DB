/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs',
            './views/partials/*.ejs'],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px'
      },
      backgroundImage:{
        'chilies': "url('../public/imgs/login/chilies.jpg')"
      },
      colors:{
        'off-white': 'rgb(239, 239, 241)'
      },
    },
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
