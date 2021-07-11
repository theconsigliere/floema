import { Renderer, Camera, Transform, Box, Program, Mesh } from 'ogl'

export default class canvas {
  constructor () {
    this.createRenderer()
  }

  createRenderer () {
    this.renderer = new Renderer()

    this.gl = this.renderer.gl

    // add canvas to the page
    document.body.appendChild(this.gl.canvas)
  }

  createCanvas () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight
    })
  }
}
