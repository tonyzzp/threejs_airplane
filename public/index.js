const Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0
}

class Sea {
    constructor() {
        let mat = new THREE.MeshPhongMaterial({
            color: Colors.blue,
            opacity: 0.6,
            transparent: true,
            flatShading: true,
        })
        this.geo = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
        this.geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        this.mesh = new THREE.Mesh(this.geo, mat)
        this.mesh.receiveShadow = true
        this.mesh.position.y = -600

        this.points = []
        this.geo.mergeVertices()
        let len = this.geo.vertices.length
        for (let i = 0; i < len; i++) {
            let v = this.geo.vertices[i]
            this.points.push({
                x: v.x,
                y: v.y,
                z: v.z,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.03 + 0.02,
                height: Math.random() * 15 + 5,
            })
        }
    }

    update() {
        this.mesh.rotation.z += 0.01
        let len = this.points.length
        for (let i = 0; i < len; i++) {
            let p = this.points[i]
            let v = this.geo.vertices[i]
            v.x = p.x + Math.sin(p.angle) * p.height
            v.y = p.y + Math.cos(p.angle) * p.height
            p.angle += p.speed
        }
        this.geo.verticesNeedUpdate = true
    }
}

class Cloud {
    constructor() {
        this.mesh = new THREE.Object3D()
        let n = 3 + Math.random() * 2
        for (let i = 0; i < n; i++) {
            let mat = new THREE.MeshPhongMaterial({
                color: Colors.white,
            })
            let geo = new THREE.BoxGeometry(20, 20, 20)
            let mesh = new THREE.Mesh(geo, mat)
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.position.x = i * 15
            mesh.position.y = Math.random() * 10
            mesh.position.z = Math.random() * 10
            mesh.rotation.z = Math.random() * Math.PI / 2
            mesh.rotation.x = Math.random() * Math.PI / 2
            let scale = Math.random() * 0.9 + 0.1
            mesh.scale.set(scale, scale, scale)
            this.mesh.add(mesh)
        }
    }
}

class Sky {

    constructor() {
        this.mesh = new THREE.Object3D()
        let angle = Math.PI * 2 / 20
        for (let i = 0; i < 20; i++) {
            let a = angle * i
            let cloud = new Cloud()
            let h = 750 + Math.random() * 200
            let x = Math.cos(a) * h
            let y = Math.sin(a) * h
            let z = -400 - Math.random() * 400;
            let scale = 1 + Math.random() * 2;
            cloud.mesh.scale.set(scale, scale, scale)
            cloud.mesh.position.set(x, y, z)
            cloud.mesh.rotation.z = a + Math.PI / 2
            this.mesh.add(cloud.mesh)
        }
    }

    update() {
        this.mesh.rotation.z += 0.01
    }
}

class Plane {
    constructor() {
        this.mesh = new THREE.Object3D()

        //身
        let box1 = new THREE.Mesh(
            new THREE.BoxGeometry(25, 20, 20),
            new THREE.MeshPhongMaterial({ color: Colors.red })
        )
        box1.castShadow = true
        box1.receiveShadow = true
        this.mesh.add(box1)

        //头
        let box2 = new THREE.Mesh(
            new THREE.BoxGeometry(8, 20, 20),
            new THREE.MeshPhongMaterial({ color: Colors.blue })
        )
        box2.position.x = 11 + 4
        box2.castShadow = true
        box2.receiveShadow = true
        this.mesh.add(box2)

        //桨
        let box3 = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 3)
                .applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2)),
            new THREE.MeshPhongMaterial({ color: Colors.brown })
        )
        box3.position.x = 11 + 8 + 1.5
        box3.castShadow = true
        box3.receiveShadow = true
        this.mesh.add(box3)

        let box4 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 30, 7),
            new THREE.MeshPhongMaterial({ color: Colors.brown })
        )
        box4.position.x = 11 + 8 + 3
        box4.castShadow = true
        box1.receiveShadow = true
        this.mesh.add(box4)

        //翅膀
        let box5 = new THREE.Mesh(
            new THREE.BoxGeometry(15, 1, 60),
            new THREE.MeshPhongMaterial({ color: Colors.red })
        )
        box5.castShadow = true
        box5.receiveShadow = true
        this.mesh.add(box5)

        //尾巴
        let box7 = new THREE.Mesh(
            new THREE.BoxGeometry(5, 10, 2),
            new THREE.MeshPhongMaterial({ color: Colors.red })
        )
        box7.position.x = -13
        box7.position.y = 10
        box7.castShadow = true
        box7.receiveShadow = true
        this.mesh.add(box7)

        this.box4 = box4
    }

    update() {
        let y = calcValue(mousePos.y, -0.75, 0.75, 25, 175)
        this.mesh.position.y = plane.mesh.position.y + (y - plane.mesh.position.y) * 0.1
        let remainY = y - this.mesh.position.y
        this.mesh.rotation.z = remainY * 0.02
        this.mesh.rotation.x = -remainY * 0.01

        this.box4.rotation.x += 0.3
    }
}


let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.set(0, 100, 200)
scene.fog = new THREE.Fog(0xf7d9aa, 100, 950)


function createLights() {
    let ambientLight = new THREE.AmbientLight(0xdc8874, 0.5)
    scene.add(ambientLight)

    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
    scene.add(hemisphereLight)

    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)
    shadowLight.position.set(150, 350, 350)
    shadowLight.castShadow = true
    shadowLight.shadow.camera.left = -400
    shadowLight.shadow.camera.right = 400
    shadowLight.shadow.camera.top = 400
    shadowLight.shadow.camera.bottom = -400
    shadowLight.shadow.camera.near = 1
    shadowLight.shadow.camera.far = 1000
    shadowLight.shadow.mapSize.width = 2000
    shadowLight.shadow.mapSize.height = 2000

    scene.add(shadowLight)
}

function createSky() {
    let sky = new Sky()
    sky.mesh.position.y = -600
    scene.add(sky.mesh)
    return sky
}

function createSea() {
    let sea = new Sea()
    scene.add(sea.mesh)
    return sea
}

function createPlane() {
    let plane = new Plane()
    plane.mesh.scale.set(0.5, 0.5, 0.5)
    plane.mesh.position.y = 100
    scene.add(plane.mesh)
    return plane
}

let mousePos = { x: 0, y: 100 }

createLights()
let sky = createSky()
let sea = createSea()
let plane = createPlane()

document.body.append(renderer.domElement)

let s = new Stats()
s.showPanel(0)
document.body.append(s.dom)
function draw() {
    s.update()
    camera.fov = calcValue(mousePos.x, -1, 1, 40, 80)
    console.log(camera.fov)
    camera.updateProjectionMatrix()
    sky.update()
    sea.update()
    plane.update()
    renderer.render(scene, camera)
    requestAnimationFrame(draw)
}
draw()


function calcValue(percent, pmin, pmax, min, max) {
    percent = Math.min(percent, pmax)
    percent = Math.max(percent, pmin)
    let span = max - min
    percent = (percent - pmin) / (pmax - pmin)
    return percent * span + min
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

renderer.domElement.addEventListener("mousemove", (e) => {
    let mx = (e.clientX / window.innerWidth) * 2 - 1
    let my = 1 - (e.clientY / window.innerHeight) * 2
    mousePos.x = mx
    mousePos.y = my
})

