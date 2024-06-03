const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/assets/stylesheets/rails/monitor/tailwind.css'
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: 'auto minmax(0, 1fr)',
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('request-opened', ['.request-opened &', '.request-opened&'])
      addVariant('current', ['.current &', '.current&'])
    })
  ],
}
