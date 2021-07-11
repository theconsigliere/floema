import Component from 'classes/Component'
import each from 'lodash/each'
import GSAP from 'gsap'
import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        images: document.querySelectorAll('img'),
        numberText: '.preloader__number__text'
      }
    })

    this.length = 0

    // split the title text into lines, using the break tags in pug
    split({
      element: this.elements.title,
      expression: '<br>'
    })

    // run it again to embed span within spans so we can make parent spans 'overflow:hidden'
    split({
      element: this.elements.title,
      expression: '<br>'
    })

    // select all child spans
    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')

    this.imageLoader()
  }

  imageLoader () {
    each(this.elements.images, element => {
      // load data-src as src into new image
      element.src = element.getAttribute('data-src')

      // when element has been loaded, pass element to new function function
      element.onload = _ => this.onImagesLoaded(element)
    })
  }

  onImagesLoaded (image) {
    // get a number of images loaded, by +1 everytime image has been passed to function
    this.length += 1

    // gives us a running percentage of images loaded
    const percent = this.length / this.elements.images.length

    // update the preloader percent string with how many images has been loaded
    // times a hundred to get a number between 0 & 100, math round to remove decimals
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      // run function after images loaded
      this.onComplete()
    }
  }

  onComplete () {
    // after all images loaded, return a promise to remove preloader from view, then run a custom event to tell index.js preloader has been completed
    return new Promise(resolve => {
      this.removePreloaderAnim = GSAP.timeline({
        delay: 2
      })

      this.removePreloaderAnim
        .to(this.elements.titleSpans, { duration: 1.5, stagger: 0.1, ease: 'expo.out', yPercent: 100 })
        .to(this.elements.numberText, { duration: 1.5, ease: 'expo.out', yPercent: 100 }, '-=1.4')
        .to(this.element, { scaleY: 0, transformOrigin: '100% 100%', ease: 'expo.out', duration: 1.5 }, '-=1')

      this.removePreloaderAnim.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
