let cfg = {
    lightX: 200,
    lightY: 400,
    lightZ: -100,
}

let clock = new THREE.Clock()
let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(100, 100, 100)
camera.lookAt(0, 0, 0)
let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
let light1 = new THREE.HemisphereLight(0xffffff, 0x000000, 0.3)
let light2 = new THREE.AmbientLight(0xffffff, 0.3)
let light3 = new THREE.DirectionalLight()
light3.position.set(cfg.lightX, cfg.lightY, cfg.lightZ)
light3.castShadow = true
light3.shadow.camera.left = -400
light3.shadow.camera.right = 400
light3.shadow.camera.top = 400
light3.shadow.camera.bottom = -400
light3.shadow.camera.near = 0.1
light3.shadow.camera.far = 1000
light3.shadow.mapSize.set(2048, 2048)
scene.add(light1)
scene.add(light2)
scene.add(light3)

//地面
let plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 })
)
plane.receiveShadow = true
scene.add(plane)

//box
let box = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
)
box.position.y = 25
box.castShadow = true
box.receiveShadow = true
scene.add(box)

//horse

// let GLTFLoader = require("three/examples/js/loaders/GLTFLoader")
let loader = new THREE.GLTFLoader()
let mixer
loader.load("res/horse.glb", (obj) => {
    console.log(obj)
    let horse = obj.scene.children[0]
    horse.scale.set(0.2, 0.2, 0.2)
    horse.position.x = 50
    horse.castShadow = true

    let anim = obj.animations[0]
    mixer = new THREE.AnimationMixer(horse)
    mixer.clipAction(anim).play()
    scene.add(horse)
}, (e) => {
    console.log(e.loaded / e.total)
}, (e) => {
    console.log(e)
})

document.body.append(renderer.domElement)
function draw() {
    let delta = clock.getDelta()
    camera.updateProjectionMatrix()
    if (mixer) {
        mixer.update(delta)
    }
    renderer.render(scene, camera)
    requestAnimationFrame(draw)
}
draw()


let gui = new dat.GUI()
let onChange = () => {
    light3.position.set(cfg.lightX, cfg.lightY, cfg.lightZ)

}
gui.add(cfg, "lightX", -500, 500, 50).onChange(onChange)
gui.add(cfg, "lightY", -500, 500, 50).onChange(onChange)
gui.add(cfg, "lightZ", -500, 500, 50).onChange(onChange)