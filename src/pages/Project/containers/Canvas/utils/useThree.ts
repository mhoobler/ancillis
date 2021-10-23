import {
  Object3D,
  Clock,
  SkinnedMesh,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  NumberKeyframeTrack,
  SkeletonHelper,
  Bone,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  MeshPhongMaterial,
  GridHelper,
  DirectionalLight,
  AmbientLight,
  DirectionalLightHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//@ts-ignore
//import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import FileCache from "./FileCache";
import ResourceTracker from "./ResourceTracker";

// *** OVERRIDE Object3D.traverse *** //
Object3D.prototype.traverse = function (callback) {
  callback(this);

  const children = this.children;

  for (let i = 0, l = children.length; i < l; i++) {
    if (children[i]) {
      children[i].traverse(callback);
    }
  }
};

// *** START: INITIALIZATION *** //
const scene = new Scene();
//const renderer = new WebGLRenderer({ antialias: true });
const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
const camera = new PerspectiveCamera(75, 16 / 9, 0.1, 200);
const fileCache = new FileCache();
const resourceTracker = new ResourceTracker();
let mixers: AnimationMixer[] = [];
let actions: AnimationAction[] = [];

// CAMERA //

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);

const updateMixers = (delta: number) => {
  mixers.forEach((am: AnimationMixer) => am.update(delta));
};

// LIGHT //
const dirLight = new DirectionalLight(0xfffffff, 0.66);
dirLight.castShadow = true;
dirLight.shadow.bias = -0.001;
dirLight.position.set(0, 20, 6);
dirLight.target.position.set(0, 0, 0);
const dirLightHelper = new DirectionalLightHelper(dirLight);

const ambLight = new AmbientLight(0x404040);

scene.add(dirLight);
scene.add(dirLight.target);
scene.add(dirLightHelper);
scene.add(ambLight);

// GROUN PLANE //
const groundGeo = new PlaneGeometry(500, 500);
const groundMat = new MeshPhongMaterial({
  color: 0xdddddd,
  depthWrite: false,
});
const ground = new Mesh(groundGeo, groundMat);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);

const grid = new GridHelper(500, 100, 0x000000, 0x000000);
scene.add(grid);

// SEGMENTS //
// ANIMATIONS //
const clock = new Clock();
// *** END: INITIALIZATION *** //

// *** START: Animations *** //
const compileKeyframes = (targetSegment: SegmentType) => {
  const keyframes: any = {};
  targetSegment.keyframes.forEach((kf: Keyframe) => {
    if (!keyframes[kf.type]) {
      keyframes[kf.type] = [];
    }
    keyframes[kf.type].push(kf);
  });
  const compiled: any = {};

  const typeKeys = Object.keys(keyframes);
  typeKeys.forEach((key: string) => {
    const targetKeyframes = keyframes[key].sort(
      (a: Keyframe, b: Keyframe) => a.start - b.start
    );

    for (let i = 0; i < targetKeyframes.length; i++) {
      const { value, start, length, type } = targetKeyframes[i];
      const end = start + length;
      const c = compiled[type]
        ? { ...compiled[type] }
        : {
            times: [],
            values: [],
          };

      if (targetKeyframes[i + 1] && targetKeyframes[i + 1].start < end) {
        const timesTuple = [start];
        const valuesTuple =
          c.values.length > 0 ? [c.values[c.values.length - 1]] : [0];

        const calcEnd = targetKeyframes[i + 1].start;
        const calcValue = (value * (start - calcEnd)) / (start - end);
        timesTuple.push(calcEnd);
        valuesTuple.push(calcValue);

        c.times = [...c.times, ...timesTuple];
        c.values = [...c.values, ...valuesTuple];
      } else {
        const timesTuple = [start, end];
        const valuesTuple =
          c.values.length > 0
            ? [c.values[c.values.length - 1], value]
            : [0, value];

        c.times = [...c.times, ...timesTuple];
        c.values = [...c.values, ...valuesTuple];
      }
      compiled[key] = { ...c };
    }
  });

  return compiled;
};
// ** END: Animations *** //

// *** START: SEGMENTS *** //
const recursivelyConstructSegments = (
  segment: SegmentType,
  segmentMap: SegmentMap,
  parent?: {
    segment: SegmentType;
    bone: Bone;
    mesh: SkinnedMesh;
    connection: any;
  }
) => {
  // Get file data
  const clone = fileCache.getClone(segment.file);
  const helper = new SkeletonHelper(clone);
  console.log(segment);

  // Map data to parent
  if (parent) {
    const split = parent.connection[0].split("_");
    split[0] = "male";
    const boneName = clone.userData[split.join("_")].split(".").join("");

    clone.traverse((obj3d: Object3D) => {
      //console.log(obj3d);
      if (obj3d instanceof SkinnedMesh) {
        const bone = obj3d.skeleton.getBoneByName(boneName);
        // add bone to parent.bone as child ?
        if (bone) {
          //console.log({ bone, parent: parent.bone });
          parent.bone.add(bone);
        }
      }
    });
  }

  // Add to scene TODO: Remove helper
  scene.add(clone);
  scene.add(helper);
  clone.visible = true;
  resourceTracker.track(clone);
  resourceTracker.track(helper);

  // Construct Animations
  const animationBoneNames = Object.keys(segment.animations);

  animationBoneNames.forEach((boneName: string) => {
    const keyframes = compileKeyframes(segment);
    const tracks: NumberKeyframeTrack[] = [];
    var length = 0;

    Object.keys(keyframes).forEach((key: string) => {
      const { times, values } = keyframes[key];
      tracks.push(new NumberKeyframeTrack(key, times, values));
      if (times[times.length - 1] > length) {
        length = times[times.length - 1];
      }
    });

    clone.traverse((obj3d: Object3D) => {
      if (obj3d instanceof SkinnedMesh) {
        const bone = obj3d.skeleton.getBoneByName(boneName);
        const name = `animation-${segment.name}`;
        if (bone) {
          const clip = new AnimationClip(name, length, tracks);
          const mixer = new AnimationMixer(bone);
          const action = mixer.clipAction(clip);
          action.paused = true;
          action.clampWhenFinished = true;
          action.play();

          actions.push(action);
          mixers.push(mixer);
        }
      }
    });
  });

  // Sort through connections, find bones, fire recursion
  const connections = segment.connections2;
  const entries = Object.entries(connections);
  if (entries.length > 0) {
    entries.forEach((connection: any) => {
      const split = connection[0].split("_");

      if (split[0] === "female" && connection[1]) {
        const targetSegment = segmentMap[connection[1]];
        const boneName = clone.userData[connection[0]].split(".").join("");

        // TODO: This looks wrong... what if there's multiple meshes?
        clone.traverse((obj3d: Object3D) => {
          if (obj3d instanceof SkinnedMesh) {
            const mesh = obj3d;
            const bone = obj3d.skeleton.getBoneByName(boneName);

            if (!bone) {
              throw new Error(
                `no bone found for segment: ${segment.id} on connection: ${connection}`
              );
            }
            recursivelyConstructSegments(targetSegment, segmentMap, {
              segment,
              bone,
              mesh,
              connection,
            });
          }
        });
      }
    });
  }
};
// *** END: SEGMENTS *** //

// *** START: RENDER *** //
const render = async (
  container: HTMLDivElement,
  segmentMap: SegmentMap,
  options: any
) => {
  // Setup Canvas & Camera
  container.innerHTML = "";
  resize(container);

  // Handle Files
  const segments = Object.values(segmentMap);
  const files = segments.map((segment: SegmentType) => {
    return segment.file;
  });
  await fileCache.updateFiles(files);
  const x = fileCache.values() as unknown;
  for (let f of x as Array<any>) {
    console.log(f.uuid);
  }

  // Handle Rendering, Skeletons, and Animations
  resourceTracker.dispose();
  actions = [];
  mixers = [];

  const bases = segments.filter((segment) => segment.type === "BASE");
  bases.forEach((base) => recursivelyConstructSegments(base, segmentMap));
  //console.log(actions, mixers);

  controls.update();

  animate();
};

const resize = (container: HTMLDivElement) => {
  container.innerHTML = "";
  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  console.log(renderer);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  camera.position.z = 25;
  camera.position.y = 25;
  container.appendChild(renderer.domElement);
  animate();
};
// *** END: RENDER *** //

const animate = () => {
  const delta = clock.getDelta();
  updateMixers(delta);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const pauseAnimations = () => {
  console.log("pause");
  actions.forEach((a: AnimationAction) => {
    a.paused = true;
  });
};

const playAnimations = () => {
  console.log("play");
  actions.forEach((a: AnimationAction) => {
    a.paused = false;
  });
};

export { pauseAnimations, playAnimations, render, resize };
