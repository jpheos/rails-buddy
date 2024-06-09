import { Controller } from '@hotwired/stimulus'
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import { format } from 'sql-formatter';

hljs.registerLanguage('sql', sql);

export default class extends Controller {
  static targets = ['container']
  static values = { query: Object, formatted: {type: Boolean, default: false} }

  connect() {
    this.formatted            = this.formattedValue
    this.textUnformatted      = this.queryValue.sql
    this.textFormatted        = format(this.textUnformatted, { language: 'postgresql' })
    this.innerHTMLUnformatted = this.#highlight(this.textUnformatted)
    this.innerHTMLFormatted   = this.#highlight(this.textFormatted)
    this.refresh()
  }

  toggleFormat() {
    this.formatted = !this.formatted
    this.element.classList.toggle('formatted', this.formatted)
    this.refresh()
  }

  copyClipboard(event) {
    navigator.clipboard.writeText(this.formatted ? this.textFormatted : this.textUnformatted)
    this.element.classList.add('copied')
    setTimeout(() => this.element.classList.remove('copied'), 1000)
  }

  refresh() {
    this.containerTarget.innerHTML = this.formatted ? this.innerHTMLFormatted : this.innerHTMLUnformatted
  }

  #highlight(string) {
    return hljs.highlight(string, { language: 'sql' }).value
  }
}
