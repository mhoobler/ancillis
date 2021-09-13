import {
  Object3D,
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
//import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import ResourceTracker from "./ResourceTracker";
//var gui: any;

// change this filename
const resTracker = new ResourceTracker();
const track = resTracker.track.bind(resTracker);
//const untrack = resTracker.untrack.bind(resTracker);
const dispose = resTracker.dispose.bind(resTracker);

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

// Initialize

const scene = new Scene();
const renderer = new WebGLRenderer();
const camera = new PerspectiveCamera(75, 16 / 9, 0.1, 1000);
const clock = new Clock();
let mixers: AnimationMixer[] = [];
let actions: AnimationAction[] = [];

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
  dispose();
  console.log("handleThree init");
  container.innerHTML = "";
  const segmentMap: SegmentMap = {};
  segments.forEach((s: SegmentType) => {
    segmentMap[s.id] = s;
  });

  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  camera.position.z = 25;
  camera.position.y = 25;

  container.appendChild(renderer.domElement);
  constructSegments(segmentMap, options);
  //const helper = new SkeletonHelper(skeleton.bones[0]);
  //scene.add(helper);
  // const skeleton = constructSkeleton(segments);
  // renderMeshes(scene, skeleton, segments, wireframe);
  // createAnimations(skeleton, segments);

  controls.update();

  // if (options.gui) {
  //   if (gui) {
  //     gui.destroy();
  //   }
  //   gui = new GUI();
  //   for (let i = 0; i < skeleton.bones.length; i++) {
  //     const bone = skeleton.bones[i];

  //     //@ts-ignore
  //     const folder = gui.addFolder("Bone " + i);

  //     folder.add(
  //       bone.position,
  //       "x",
  //       -10 + bone.position.x,
  //       10 + bone.position.x
  //     );
  //     folder.add(
  //       bone.position,
  //       "y",
  //       -10 + bone.position.y,
  //       10 + bone.position.y
  //     );
  //     folder.add(
  //       bone.position,
  //       "z",
  //       -10 + bone.position.z,
  //       10 + bone.position.z
  //     );

  //     folder.add(bone.rotation, "x", -Math.PI * 0.5, Math.PI * 0.5);
  //     folder.add(bone.rotation, "y", -Math.PI * 0.5, Math.PI * 0.5);
  //     folder.add(bone.rotation, "z", -Math.PI * 0.5, Math.PI * 0.5);

  //     folder.__controllers[0].name("position.x");
  //     folder.__controllers[1].name("position.y");
  //     folder.__controllers[2].name("position.z");

  //     folder.__controllers[3].name("rotation.x");
  //     folder.__controllers[4].name("rotation.y");
  //     folder.__controllers[5].name("rotation.z");
  //   }
  // }

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

// Reduce keyframes to times[] & values[]
// Also handles "overlapping times"
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

const constructSegments = (segments: SegmentMap, options: any) => {
  console.log(segments);
  const keys = Object.keys(segments);
  const segmentsArray = keys.map((key: string) => segments[key]);
  const bases = segmentsArray.filter((segment: SegmentType) => segment.isBase);
  const skeletons = [];

  bases.forEach((base: SegmentType) => {
    // recursively create Bones
    // ***********************
    const constructBones = (targetSegment: SegmentType) => {
      const { id, name, connections } = targetSegment;
      // Create newBone
      const newBone = new Bone();
      newBone.position.y = 10;
      newBone.name = `bone-${name}`;
      newBone.userData.segmentId = id;
      const bones = [newBone];

      // Check for Children
      if (connections.length > 0) {
        // Create ChildrenBones;
        const childrenBones = connections.map((connKey: string) => {
          return constructBones(segments[connKey]);
        });
        // Assign ChildrenBones to newBone
        childrenBones.flat().forEach((b: Bone | Bone[]) => {
          if (b instanceof Bone && connections.includes(b.userData.segmentId)) {
            newBone.add(b);
          }
        });

        // Push into bones array
        const flatBones = childrenBones.reduce(
          (acc, value) => acc.concat(value),
          []
        );
        flatBones.forEach((b: Bone) => {
          bones.push(b);
        });
      }

      console.log(bones);
      return bones;
    };
    const bones = constructBones(base);
    bones[0].position.y = -10 * (bones.length - 1);
    const skeleton = new Skeleton(bones);
    const helper = new SkeletonHelper(skeleton.bones[0]);
    track(helper);
    scene.add(helper);

    // recursively create Animations
    // ***********************
    const constructAnimations = (targetSegment: SegmentType) => {
      const { name, connections } = targetSegment;
      const keyframes = compileKeyframes(targetSegment);
      const tracks: any = [];
      var length = 0;
      const bone = skeleton.getBoneByName(`bone-${name}`);
      if (!bone) {
        throw new Error(`no bone found for animation: ${name}`);
      }

      Object.keys(keyframes).forEach((key: string) => {
        const { times, values } = keyframes[key];
        tracks.push(new NumberKeyframeTrack(key, times, values));
        if (times[times.length - 1] > length) {
          length = times[times.length - 1];
        }
      });

      const clip = new AnimationClip(`animation-${name}`, length, tracks);
      const mixer = new AnimationMixer(bone);
      const action = mixer.clipAction(clip);
      console.log(action);
      action.paused = true;
      action.clampWhenFinished = true;
      action.play();

      actions.push(action);
      mixers.push(mixer);
      connections.forEach((key: string) => {
        constructAnimations(segments[key]);
      });
    };
    constructAnimations(base);

    const constructMesh = (targetBone: Bone) => {
      const { children } = targetBone;
      // const segment = segments[targetBone.userData.segmentId];
      const index = skeleton.bones.indexOf(targetBone);

      const geometry = skinGeometry(new SphereGeometry(5, 16, 8), index);
      console.log(geometry);
      const material = new MeshBasicMaterial({ color: 0x00aaff });

      const mesh = new SkinnedMesh(geometry, material);
      mesh.position.y = 10 * index;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);
      track(mesh);
      scene.add(mesh);

      if (options.wireframe) {
        const wfMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          wireframeLinewidth: 2,
        });
        const wfMesh = new SkinnedMesh(geometry, wfMaterial);
        wfMesh.position.y = 10 * index;
        wfMesh.add(skeleton.bones[0]);
        wfMesh.bind(skeleton);
        track(wfMesh);
        scene.add(wfMesh);
      }

      children.forEach((child: Object3D) => {
        if (child instanceof Bone) {
          constructMesh(child);
        }
      });
    };

    constructMesh(skeleton.bones[0]);

    console.log(skeleton);
  });
  return "";
};

export { init, playAnimations, pauseAnimations };
