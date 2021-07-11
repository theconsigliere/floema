import Button from 'classes/Button'
import Page from 'classes/Page'

export default class Detail extends Page {
  constructor () {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        link: '.detail__button'
      }
    })
  }

  // this method would override parent 'page class' create method so we must call super
  create () {
    super.create()

    this.link = new Button({
      element: this.elements.link
    })
  }

  destroy () {
    super.destroy()

    this.link.removeEventListeners()
  }
}
