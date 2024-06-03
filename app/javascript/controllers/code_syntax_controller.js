import { Controller } from '@hotwired/stimulus'
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import { format } from 'sql-formatter';

hljs.registerLanguage('sql', sql);

export default class extends Controller {
  static values = { query: Object }

  get sql() {
    return this.queryValue.sql
  }

  connect() {
    const formatted = format(this.sql, { language: 'postgresql' })
    this.element.innerHTML = hljs.highlight(formatted, { language: 'sql' }).value
  }
}
