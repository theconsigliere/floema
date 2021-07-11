import GSAP from 'gsap'
import map from 'lodash/map'
import each from 'lodash/each'
import Prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'

import Title from 'animations/Title'
import Paragraph from 'animations/Paragraph'
import Label from 'animations/Label'
import Highlight from 'animations/Highlight'
import { ColorsManager } from 'classes/Colors'
import AsyncLoad from 'classes/AsyncLoad'

export default class Page {
  constructor ({ id, element, elements }) {
    this.id = id
    this.selector = element
    // childelements is going to be an object
    this.selectorChildren = {
      ...elements,

      animationsHighlights: '[data-animation="highlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      preloads: '[data-src]'
    }

    // for Safari and shit browsers
    this.transformPrefix = Prefix('transform')

    // save a function bind to re-use
    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  create () {
    // page class is intialized assign this.element, saves memory
    this.element = document.querySelector(this.selector)

    // map of different child elements, that are exposed so we can use them directly
    this.elements = {}

    // create smooth scroll when page is initiated
    this.scroll = {
      // current scroll position
      current: 0,
      // target scroll position
      target: 0,
      // last position of scroll
      last: 0,
      // page height
      limit: 0
    }

    // CANNOT use 'forEach' on an object, must use LODASH
    // this.selectorChildren.forEach(entry => { })

    // LODASH EACH METHOD
    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    // create each animations
    this.createAnimations()
    this.createImagePreloads()
  }

  createImagePreloads () {
    this.preloads = map(this.elements.preloads, element => {
      return new AsyncLoad({ element })
    })
  }

  createAnimations () {
    this.animations = []

    // run title through LODASH map method
    // Creates an array of values by running each element in collection thru function
    this.animationsHighlights = map(this.elements.animationsHighlights, element => {
      return new Highlight({
        element
      })
    })

    this.animations.push(...this.animationsHighlights)

    // run title through LODASH map method
    // Creates an array of values by running each element in collection thru function
    this.animationsTitles = map(this.elements.animationsTitles, element => {
      return new Title({
        element
      })
    })

    this.animations.push(...this.animationsTitles)

    this.animationsLabels = map(this.elements.animationsLabels, element => {
      return new Label({
        element
      })
    })

    this.animations.push(...this.animationsLabels)

    this.animationsParagraphs = map(this.elements.animationsParagraphs, element => {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.animationsParagraphs)
  }

  show () {
    return new Promise(resolve => {
      // change page color when new page is fetched
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })

      this.animationIn = GSAP.timeline()

      this.animationIn.fromTo(this.element,
        { autoAlpha: 0 }, {
          autoAlpha: 1
        })

      // '.call' Adds a callback to the end of the timeline
      this.animationIn.call(_ => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      this.destroy()

      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }

  // for scroll jacking purposes get mouse wheel event
  onMouseWheel (event) {
    // normalize the vertical scroll amount across browsers
    const { pixelY } = NormalizeWheel(event)

    //  pixelY is essentially the speed of how many pixels we scroll
    this.scroll.target += pixelY
  }

  onResize () {
    if (this.elements.wrapper) {
      // remove the height of the screen as value will be screen height to big
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }

    // for each of the titles, label, paragraphs

    each(this.animations, animation => animation.onResize())
  }

  update () {
    // clamp the scroll number between the start which is zero, the page height
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
    // take us from current position to target position using a smooth lerp transition
    // last number is easing of interpolation
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    // browser doesn't handle minus numbers very well in trasnforms, make these zero
    if (this.scroll.current < 0.01) {
      this.scroll.current = 0
    }

    // update the wrapper to how much we have scrolled the page
    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  destroy () {
    this.removeEventListeners()
  }
}
