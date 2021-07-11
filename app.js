require('dotenv').config()
const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = 3000
const path = require('path')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  })
}

// Link Resolver
const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }
  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'collections') {
    return '/collections'
  }
  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  // UA Parser for help on different device's
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  // return number of collections
  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }

  next()
})

// set direct path to views folder
const directPathViews = path.join(__dirname, 'views')

app.set('views', directPathViews)
// tell express about pug
app.set('view engine', 'pug')

// for templates we are goin to use on every page
const handleRequest = async api => {
  const meta = await api.getSingle('meta')
  const preloader = await api.getSingle('preloader')
  const navigation = await api.getSingle('navigation')

  return {
    meta,
    navigation,
    preloader
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle('home')
  const defaults = await handleRequest(api)

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/home', {
    ...defaults,
    home,
    collections
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const about = await api.getSingle('about')
  const defaults = await handleRequest(api)

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const product = await api.getByUID('product', req.params.uid, {
    // get data from content relationship filed type
    fetchLinks: 'collection.title'
  })

  res.render('pages/detail', {
    ...defaults,
    product
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle('home')
  const defaults = await handleRequest(api)
  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/collections', {
    ...defaults,
    collections,
    home
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
