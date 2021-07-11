import each from 'lodash/each'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import Canvas from 'components/Canvas'

// PAGES
import About from 'pages/About'
// name the js file in each folder as 'index.js' automatically pulls through when importing the folder
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App {
  constructor () {
    this.createContent()
    this.createPreloader()
    this.createNavigation()
    this.createCanvas()
    this.createPages()
    this.addEventListeners()
    this.addLinkListeners()
    this.update()
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader () {
    this.preloader = new Preloader()
    // looking for custom event from preloader, once done run onPreloaded
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas () {
    this.canvas = new Canvas()
  }

  createContent () {
    // find content div and identify which data template is in the DOM
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

    // a map of different pages we can initialize
    this.pages = {
      about: new About(),
      home: new Home(),
      collections: new Collections(),
      detail: new Detail()
    }

    // gets the current page from the this.pages object, using this.template as the index
    this.page = this.pages[this.template]

    // only call create on the page we are on
    this.page.create()
  }

  onPreloaded () {
    this.preloader.destroy()

    // when page is created run rezize
    this.onResize()

    // show page once preloader has been completed
    this.page.show()

    this.update()
  }

  // fetch pages using Ajax so we can use page transitions
  addLinkListeners () {
    const links = document.querySelectorAll('a')

    // using lodash as a forEach method
    each(links, link => {
      // not using addEventListener as onClick can be easily overridden
      link.onclick = event => {
        event.preventDefault()

        // deconstructing target from link and remamning it as href
        const { href } = link

        this.onChange({ url: href })
      }
    })
  }

  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    // run resize every time page changes
    window.addEventListener('resize', this.onResize.bind(this))
  }

  onResize () {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize()
    }

    // if page is in viewport or we are running an update run request frame animation
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  update () {
    // if page is in viewport or we are running an update run request frame animation
    if (this.page && this.page.update) {
      this.page.update()
    }
    // method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false

    })
  }

  async onChange ({ url, push = true }) {
    // when animating to new page first animate out current page
    await this.page.hide()

    // grab next page content when ready
    const request = await window.fetch(url)

    // if fetch successful
    if (request.status === 200) {
      // grab html of next page from request
      const html = await request.text()
      // create div to put html content into
      const div = document.createElement('div')

      if (push) {
        // use history window api to get route
        window.history.pushState({}, '', url)
      }

      // put html into div
      div.innerHTML = html

      // grab just the main div content from the html, this will be the page we are animating to not the head or naviagtion which stays the same
      const divContent = div.querySelector('.content')

      // set data-template to new page data-template
      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template)

      // change page to new page content
      this.content.innerHTML = divContent.innerHTML

      // set current page to page we have animated to
      this.page = this.pages[this.template]

      // display new page
      this.page.create()

      // when page is created run rezize
      this.onResize()

      this.page.show()

      // REFRESH page links
      this.addLinkListeners()
    } else {
      console.log('Error')
    }
  }
}

new App()
