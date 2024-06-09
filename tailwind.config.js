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
  function({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey]
          let newVars
          if (typeof value === 'string') {
            newVars = { [`--color${colorGroup}-${colorKey}`.replace('-DEFAULT', '')]: value }
          }
          else {
            newVars = extractColorVars(value, `-${colorKey}`)
          }
          return { ...vars, ...newVars }
        }, {})
      }
      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
    plugin(function ({ addVariant }) {
      addVariant('request-opened', ['.request-opened &', '.request-opened&'])
      addVariant('formatted', ['.formatted &', '.formatted&'])
      addVariant('copied', ['.copied &', '.copied&'])
      addVariant('current', ['.current &', '.current&'])
    })
  ],
}
