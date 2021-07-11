import each from 'lodash/each'
import EventEmitter from 'events'

// EVENT EMITTER
// USED FOR CUSTOM EVENTS, A NODE PACKAGE
// in this case runs a custom event when we load all of the images

export default class Component extends EventEmitter {
  constructor ({ element, elements }) {
    // intialize construtor from parent class, in this case EventEmitter
    super()
    this.selector = element
    // childelements is going to be an object
    this.selectorChildren = { ...elements }

    // to initialize straight away
    this.create()
    this.addEventListeners()
  }

  create () {
    // if this.selector has been intialized and is a selected DOM element don't run queryselector again or we will get an error
    this.selector instanceof window.HTMLElement ? this.element = this.selector : this.element = document.querySelector(this.selector)

    // empty object to put elements into
    this.elements = {}

    // CANNOT use 'forEach' on an object, must use LODASH
    // this.selectorChildren.forEach(entry => { })

    // LODASH EACH METHOD

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        // every entry that is either a HTML Element, NodeList or an Array at the position of 'Key' add to entries
        this.elements[key] = entry
      } else {
        // if entry is not above select all of entry and add it
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          // dont add to entry
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })
  }

  addEventListeners () {}

  removeEventListeners () {}
}
