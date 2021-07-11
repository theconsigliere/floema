import GSAP from 'gsap'
import Animation from 'classes/Animation'
import { calculate, split } from 'utils/text'
// import each from 'lodash/each'

export default class Title extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    // splits sentencce into words, append true to include spaces
    split({ element: this.element, append: true })
    split({ element: this.element, append: true })

    this.elementLinesSpans = this.element.querySelectorAll('span span')

    this.onResize()
  }

  // overwrites parent class method
  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    // Check if we are animating so it doesn't spaz the whole titles out
    if (this.isAnimatedIn) {
      return
    }

    this.isAnimatedIn = true

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    this.elementsLines.forEach((line, index) => {
      this.timelineIn.fromTo(line, {
        y: '100%'
      }, {
        duration: 1.5,
        delay: index * 0.3,
        y: '0%',
        ease: 'expo.out'
      }, 0)
    })
  }

  animateOut () {
    this.isAnimatedIn = false
    // reset animation as soon as out of viewport, no transition needed as this can\t be seen
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  // bind resize events to page
  onResize () {
    this.elementsLines = calculate(this.elementLinesSpans)
  }
}
