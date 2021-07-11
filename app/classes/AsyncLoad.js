import Component from 'classes/Component'

export default class AsyncLoad extends Component {
  constructor ({ element }) {
    super({ element })

    this.createObserver()
  }

  // check for image in viewport and load it in
  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('intersecting', this.element.src)
          if (!this.element.src) {
            console.log('run')
            this.element.src = this.element.getAttribute('data-src')
            this.element.onload = _ => {
              this.element.classList.add('loaded')
            }
          } else {
            // if image already loaded
            this.element.classList.add('loaded')
          }
        }
      })
    })

    this.observer.observe(this.element)
  }
}
