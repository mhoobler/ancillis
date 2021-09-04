import {
  NumberKeyframeTrack,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  Clock,
  SkinnedMesh,
  MeshBasicMaterial,
  Uint16BufferAttribute,
  Float32BufferAttribute,
  BufferGeometry,
  SkeletonHelper,
  Skeleton,
  Bone,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  SphereGeometry,
  MeshPhongMaterial,
  GridHelper,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import ResourceTracker from "./ResourceTracker";
var gui: any;

// change this filename
console.log("APPLE FIRED");
var nameSet = new Set();
var skeleton = new Skeleton([]);
const resTracker = new ResourceTracker();
const track = resTracker.track.bind(resTracker);
const untrack = resTracker.untrack.bind(resTracker);
const dispose = resTracker.dispose.bind(resTracker);

// TODO: change how this works so we can allow more advanced segments
// Basically whole thing needs to change
const constructSkeleton = (segments: SegmentType[]) => {
  let prevBone = new Bone();
  prevBone.name = "FIRST";
  prevBone.position.y = 0;
  const bones = [prevBone];

  for (let i = 0; i < segments.length; i++) {
    const { name } = segments[i];
    if (!nameSet.has(`bone-${name}`)) {
      console.log("ADD BONE");
      const newBone = new Bone();
      newBone.name = `bone-${name}`;
      nameSet.add(`bone-${name}`);
      newBone.position.y = 10;
      prevBone.add(newBone);
      bones.push(newBone);
      prevBone = newBone;
    }
    // TODO: else edit bone ?
  }
  bones[0].position.y = -10 * (segments.length - 1);
  const skeleton = new Skeleton(bones);
  console.log(skeleton);
  return skeleton;
};

const skinGeometry = (geometry: BufferGeometry, index: number) => {
  const { count } = geometry.attributes.position;
  const skinWeight: number[] = [];
  const skinIndex: number[] = [];

  for (let i = 0; i < count; i++) {
    skinIndex.push(index, index + 1, 0, 0);
    skinWeight.push(1, 0, 0, 0);
  }
  geometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeight, 4)
  );
  geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndex, 4));

  return geometry;
};

// TODO: determine typeof BufferGeometry based on segment
const renderMeshes = (
  scene: Scene,
  skeleton: Skeleton,
  segments: SegmentType[],
  wireframe: boolean
) => {
  for (let i = 0; i < segments.length; i++) {
    const { name } = segments[i];
    if (!nameSet.has(`mesh-${name}`)) {
      console.log("ADD MESH");
      const geometry = skinGeometry(new SphereGeometry(5, 16, 8), i);
      const material = new MeshBasicMaterial({ color: 0x00aaff });
      const mesh = new SkinnedMesh(geometry, material);
      mesh.name = `mesh-${name}`;
      nameSet.add(`mesh-${name}`);

      if (wireframe) {
        const wfMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          wireframeLinewidth: 2,
        });
        const wfMesh = new SkinnedMesh(geometry, wfMaterial);
        wfMesh.position.y = 10 * i;
        wfMesh.name = `wfMesh-${name}`;
        nameSet.add(`wfMesh-${name}`);
        wfMesh.add(skeleton.bones[0]);
        wfMesh.bind(skeleton);
        scene.add(wfMesh);

        track(wfMesh);
      }

      mesh.position.y = 10 * i;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);
      scene.add(mesh);

      track(mesh);
    }
    // TODO: else edit bone ?
  }
};

type ClipData = {
  tuples: [time: number, value: number][];
  name: KFTypes;
};

const createAnimations = (skeleton: Skeleton, segments: SegmentType[]) => {
  console.log("createAnimations");
  // Restructure keyframe data
  var length = 0;
  for (let segment of segments) {
    // THIS NAMING CONVENTION IS HORRIBLE
    const mappedClipData: { [key: string]: ClipData } = {};

    for (let kf of segment.keyframes) {
      const mappedProp = mappedClipData[kf.type];
      const end = kf.start + kf.length;
      length = end > length ? end : length;

      if (mappedProp) {
        const { tuples } = mappedProp;
        const last = tuples[tuples.length - 1];
        const newTuples: [number, number][] = [
          ...tuples,
          [kf.start, last[1]],
          [end, kf.value],
        ];
        mappedClipData[kf.type] = {
          ...mappedProp,
          tuples: newTuples,
        };
      } else {
        mappedClipData[kf.type] = {
          name: kf.type,
          tuples: [
            [kf.start, 0],
            [end, kf.value],
          ],
        };
      }
    }

    // Handle THREE constructors
    const mapKeys = Object.keys(mappedClipData);
    const { name } = segment;
    const bone = skeleton.getBoneByName(`bone-${name}`);
    const tracks = [];
    if (bone) {
      for (let key of mapKeys) {
        const { name, tuples } = mappedClipData[key];
        const sorted = tuples.sort((a, b) => a[0] - b[0]);
        const times = sorted.map((n: [number, number]) => n[0]);
        const values = sorted.map((n: [number, number]) => n[1]);
        tracks.push(new NumberKeyframeTrack(name, times, values));
      }

      if (!nameSet.has(`animation-${name}`)) {
        const kfName = `animation-${name}`;
        nameSet.add(kfName);

        const clip = new AnimationClip(kfName, length, tracks);
        const mixer = new AnimationMixer(bone);
        const action = mixer.clipAction(clip);
        action.paused = true;
        action.clampWhenFinished = true;
        action.play();

        actions.push(action);
        mixers.push(mixer);
      }
    }
  }
};

// Initialize

const scene = new Scene();
const renderer = new WebGLRenderer();
const camera = new PerspectiveCamera(75, 16 / 9, 0.1, 1000);
const clock = new Clock();
const mixers: AnimationMixer[] = [];
const actions: AnimationAction[] = [];

const updateMixers = (delta: number) => {
  mixers.forEach((am: AnimationMixer) => am.update(delta));
};

const groundGeo = new PlaneGeometry(500, 500);
const groundMat = new MeshPhongMaterial({
  color: 0xdddddd,
  depthWrite: false,
});
const ground = new Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);

const grid = new GridHelper(500, 100, 0x000000, 0x000000);
scene.add(grid);

const hemiLight = new HemisphereLight(0xfffffff, 0x444444, 0.6);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);

const init = (
  container: HTMLDivElement,
  segments: SegmentType[],
  options: any = {}
) => {
  const { wireframe } = options;
  container.innerHTML = "";

  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  camera.position.z = 25;
  camera.position.y = 25;

  container.appendChild(renderer.domElement);
  const skeleton = constructSkeleton(segments);
  const helper = new SkeletonHelper(skeleton.bones[0]);
  scene.add(helper);
  renderMeshes(scene, skeleton, segments, wireframe);
  createAnimations(skeleton, segments);

  controls.update();

  if (options.gui) {
    if (gui) {
      gui.destroy();
    }
    gui = new GUI();
    for (let i = 0; i < skeleton.bones.length; i++) {
      const bone = skeleton.bones[i];

      //@ts-ignore
      const folder = gui.addFolder("Bone " + i);

      folder.add(
        bone.position,
        "x",
        -10 + bone.position.x,
        10 + bone.position.x
      );
      folder.add(
        bone.position,
        "y",
        -10 + bone.position.y,
        10 + bone.position.y
      );
      folder.add(
        bone.position,
        "z",
        -10 + bone.position.z,
        10 + bone.position.z
      );

      folder.add(bone.rotation, "x", -Math.PI * 0.5, Math.PI * 0.5);
      folder.add(bone.rotation, "y", -Math.PI * 0.5, Math.PI * 0.5);
      folder.add(bone.rotation, "z", -Math.PI * 0.5, Math.PI * 0.5);

      folder.__controllers[0].name("position.x");
      folder.__controllers[1].name("position.y");
      folder.__controllers[2].name("position.z");

      folder.__controllers[3].name("rotation.x");
      folder.__controllers[4].name("rotation.y");
      folder.__controllers[5].name("rotation.z");
    }
  }

  const animate = () => {
    const delta = clock.getDelta();
    updateMixers(delta);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
};

const playAnimations = () => {
  console.log("play");
  actions.forEach((a: AnimationAction) => {
    a.paused = false;
  });
};

const pauseAnimations = () => {
  console.log("pause");
  actions.forEach((a: AnimationAction) => {
    a.paused = true;
  });
};

export { init, playAnimations, pauseAnimations };
