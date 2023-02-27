import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import {
  BoxGeometry,
  ConeGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  SphereGeometry,
} from "three";
import doorColor from "./textures/door/color.jpg";
import doorAlpha from "./textures/door/alpha.jpg";
import doorAmbientOcclusion from "./textures/door/ambientOcclusion.jpg";
import doorHeight from "./textures/door/height.jpg";
import doorNormal from "./textures/door/normal.jpg";
import doorMetalness from "./textures/door/metalness.jpg";
import doorRoughness from "./textures/door/roughness.jpg";
import bricksColor from "./textures/bricks/color.jpg";
import bricksAmbientOcclusion from "./textures/bricks/ambientOcclusion.jpg";
import bricksNormal from "./textures/bricks/normal.jpg";
import bricksRoughness from "./textures/bricks/roughness.jpg";
import grassColor from "./textures/grass/color.jpg";
import grassAmbientOcclusion from "./textures/grass/ambientOcclusion.jpg";
import grassNormal from "./textures/grass/normal.jpg";
import grassRoughness from "./textures/grass/roughness.jpg";

const FOG_COLOR = 0x262837;
const HOUSE_WIDTH = 4;
const HOUSE_DEPTH = 4;
const HOUSE_HEIGHT = 2.5;
const ROOF_RADIUS = 3.5;
const ROOF_HEIGHT = 1;
const DOOR_HEIGHT = 2.2;
const GRAVE_WIDTH = 0.6;
const GRAVE_HEIGHT = 0.8;
const GRAVE_DEPTH = 0.2;
const GRAVES_AMOUNT = 50;
const GRAVE_INNER_RADIUS = 4;
const GRAVE_OUTER_RADIUS = 8;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const fog = new Fog(FOG_COLOR, 6, 12);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load(doorColor);
const doorAlphaTexture = textureLoader.load(doorAlpha);
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusion);
const doorHeightTexture = textureLoader.load(doorHeight);
const doorNormalTexture = textureLoader.load(doorNormal);
const doorMetalnessTexture = textureLoader.load(doorMetalness);
const doorRoughnessTexture = textureLoader.load(doorRoughness);

const bricksColorTexture = textureLoader.load(bricksColor);
const bricksAmbientOcclusionTexture = textureLoader.load(
  bricksAmbientOcclusion
);
const bricksNormalTexture = textureLoader.load(bricksNormal);
const bricksRoughnessTexture = textureLoader.load(bricksRoughness);

const grassColorTexture = textureLoader.load(grassColor);
grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = RepeatWrapping;
grassColorTexture.wrapT = RepeatWrapping;
const grassAmbientOcclusionTexture = textureLoader.load(grassAmbientOcclusion);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
const grassNormalTexture = textureLoader.load(grassNormal);
grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = RepeatWrapping;
grassNormalTexture.wrapT = RepeatWrapping;
const grassRoughnessTexture = textureLoader.load(grassRoughness);
grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = RepeatWrapping;
grassRoughnessTexture.wrapT = RepeatWrapping;

/**
 * House
 */

const house = new Group();
scene.add(house);

const walls = new Mesh(
  new BoxGeometry(HOUSE_WIDTH, HOUSE_HEIGHT, HOUSE_DEPTH),
  new MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = HOUSE_HEIGHT / 2;
house.add(walls);

const roof = new Mesh(
  new ConeGeometry(ROOF_RADIUS, ROOF_HEIGHT, 4),
  new MeshStandardMaterial({ color: 0xb35f45 })
);
roof.position.y = HOUSE_HEIGHT + ROOF_HEIGHT / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

const door = new Mesh(
  new PlaneGeometry(DOOR_HEIGHT, DOOR_HEIGHT, 1024, 1024),
  new MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.x = HOUSE_WIDTH / 2 + 0.001;
door.position.y = DOOR_HEIGHT / 2 - 0.2;
door.rotation.y = Math.PI / 2;
house.add(door);

const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: 0x89c854 });
const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 1, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.5, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
scene.add(bush1);
scene.add(bush2);
scene.add(bush3);
scene.add(bush4);

const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxGeometry(GRAVE_WIDTH, GRAVE_HEIGHT, GRAVE_DEPTH);
const graveMaterial = new MeshStandardMaterial({ color: 0xb2b6b1 });
for (let i = 0; i < GRAVES_AMOUNT; i++) {
  const angle = 2 * Math.PI * Math.random();

  const radius =
    (GRAVE_OUTER_RADIUS - GRAVE_INNER_RADIUS) * Math.random() +
    GRAVE_INNER_RADIUS;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, GRAVE_HEIGHT / 2 - 0.2, z);
  grave.rotation.y = (Math.random() - 0.5) * Math.PI * 0.2;
  grave.rotation.z = (Math.random() - 0.5) * Math.PI * 0.1;
  grave.castShadow = true;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 1024, 1024),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new PointLight(0xff7d46, 1, 7);
doorLight.position.set(2.7, 2.2, 0);
house.add(doorLight);

const ghost1 = new PointLight(0xff00ff, 2, 3);
scene.add(ghost1);
const ghost2 = new PointLight(0x00ffff, 2, 3);
scene.add(ghost2);
const ghost3 = new PointLight(0xffff00, 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(FOG_COLOR);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

moonLight.castShadow = true;

doorLight.castShadow = true;
doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.set(256, 256);
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.set(256, 256);
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.set(256, 256);
ghost3.shadow.camera.far = 7;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle * 2.5);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
