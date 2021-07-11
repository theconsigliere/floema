import Component from 'classes/Component'
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from 'utils/color'
import GSAP from 'gsap'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    GSAP.to(this.element, {
      color: template === 'about' ? COLOR_BRIGHT_GRAY : COLOR_QUARTER_SPANISH_WHITE,
      duration: 1.5
    })

    this.elements.items.forEach((item) => {
      // check if link matches template hide the link
      // console.log(item.textContent.toLowerCase(), template)

      if (item.textContent.toLowerCase() === template) {
        GSAP.to(item, { autoAlpha: 0 })
      }

      GSAP.set(item, {
        autoAlpha: 1,
        //   delay: 0.75,
        duration: 0.75
      })
    })
  }
}
