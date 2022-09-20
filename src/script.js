import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Group } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg")
const bricksAmbientOcclusionTexture = textureLoader.load("/textures/bricks/ambientOcclusion.jpg")
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg")
const bricksRoughnessTexture = textureLoader.load("/textures/bricks/roughness.jpg")

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg")
const grassAmbientOcclusionTexture = textureLoader.load("/textures/grass/ambientOcclusion.jpg")
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg")
const grassRoughnessTexture = textureLoader.load("/textures/grass/roughness.jpg")

grassColorTexture.repeat.set(40, 40)
grassAmbientOcclusionTexture.repeat.set(40, 40)
grassNormalTexture.repeat.set(40, 40)
grassRoughnessTexture.repeat.set(40, 40)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// House group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = walls.geometry.parameters.height / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
house.add(roof)
roof.position.y = walls.geometry.parameters.height + 0.5
roof.rotation.y = Math.PI / 4

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 50, 50),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
house.add(door)
door.position.y = 2 / 2
door.position.z = 4 / 2 + 0.01

// Bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(.8, .2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(.5, .5, .5)
bush2.position.set(1.4, .1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(.8, .8, .8)
bush3.position.set(-.8, .1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(.3, .3, .3)
bush4.position.set(-1, .05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveMaterial =  new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })
const graveGeometry = new THREE.BoxGeometry(.6, 1, .2)

for(let i = 0; i < 50; i++) {
    let grave = new THREE.Mesh(graveGeometry, graveMaterial);

    let angle = Math.random() * Math.PI * 2
    let radius = 3 + Math.random() * 6

    grave.position.x = Math.sin(angle) * radius
    grave.position.y = (Math.random() / 3)
    grave.position.z = Math.cos(angle) * radius

    grave.rotation.y = (Math.random() - 0.5) * 0.5
    grave.rotation.z = (Math.random() - 0.5) * 0.3

    grave.castShadow = true
    grave.receiveShadow = true

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.125)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.125)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight( 0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
const ghost3 = new THREE.PointLight(0xffff00, 2, 3)

scene.add(ghost1, ghost2, ghost3)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor(0x262837)

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
roof.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true
walls.receiveShadow = true

// Shadow optimising performance
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Animate ghosts
    //ghost1
    let ghostAngle1 = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghostAngle1) * (5 + Math.sin(elapsedTime * 0.32))
    ghost1.position.y = Math.sin(elapsedTime * 3)
    ghost1.position.z = Math.sin(ghostAngle1) * (5 + Math.sin(elapsedTime * 0.32))
    
    //ghost2
    let ghostAngle2 = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghostAngle2) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) + 0.25
    ghost2.position.z = Math.sin(ghostAngle2) * 5

    //ghost3
    let ghostAngle3 = -elapsedTime * 0.63
    ghost3.position.x = Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 1.5) + 0.25
    ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5))

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()