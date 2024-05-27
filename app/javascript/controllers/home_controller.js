import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  openRequest() {
    this.element.classList.add('request-opened')
  }

  closeRequest() {
    this.element.classList.remove('request-opened')
  }
}
