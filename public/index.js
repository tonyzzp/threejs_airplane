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
        let geo = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
        geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        this.mesh = new THREE.Mesh(geo, mat)
        this.mesh.receiveShadow = true
        this.mesh.position.y = -600
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
    // 半球光就是渐变的光；
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // 设置光源的方向。  
    // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
    shadowLight.position.set(150, 350, 350);

    // 开启光源投影
    shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // 为了使这些光源呈现效果，只需要将它们添加到场景中
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createSky() {
    let sky = new THREE.Object3D()
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
        sky.add(cloud.mesh)
    }
    sky.position.y = -600
    scene.add(sky)

    return sky
}

function createSea() {
    let sea = new Sea()
    scene.add(sea.mesh)

    return sea.mesh
}

createLights()
let sky = createSky()
let sea = createSea()


document.body.append(renderer.domElement)

let s = new Stats()
s.showPanel(0)
document.body.append(s.dom)
function draw() {
    s.begin()
    sky.rotation.z += 0.01
    sea.rotation.z += 0.01
    renderer.render(scene, camera)
    s.end()
    requestAnimationFrame(draw)
}
draw()