import GSAP from 'gsap'
import Animation from 'classes/Animation'

export default class Highlight extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })
  }

  // overwrites parent class method
  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    this.timelineIn.fromTo(this.element, {
      autoAlpha: 0,
      scale: 1.2
    }, {
      autoAlpha: 1,
      ease: 'expo.out',
      scale: 1,
      duration: 1.5

    })
  }

  animateOut () {
    // reset animation as soon as out of viewport, no transition needed as this can\t be seen
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }
}
