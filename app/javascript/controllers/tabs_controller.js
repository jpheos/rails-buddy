import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['panel', 'tab']

  nav(event) {
    this.tabTargets.forEach((tab) => {
      tab.classList.toggle('current', tab === event.target)
    })

    this.panelTargets.forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== event.target.getAttribute('target'))
    })
  }
}
