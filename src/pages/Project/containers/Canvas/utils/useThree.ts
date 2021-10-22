/* eslint-disable */
import {
  Object3D,
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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//@ts-ignore
import test_base from "./test_base.gltf";
//@ts-ignore
import test_limb from "./test_limb.gltf";

import FileCache from "./FileCache";
import ResourceTracker from "./ResourceTracker";

// *** OVERRIDE Object3D.traverse *** //
Object3D.prototype.traverse = function (callback) {
  callback(this);

  const children = this.children;

  for (let i = 0, l = children.length; i < l; i++) {
    if (children[i]) {
      children[i].traverse(callback);
      console.log(this.userData.name, { ...this.children }, i);
    } else {
      console.warn(this.userData.name, { ...this.children }, i);
    }
  }
};

// *** START: INITIALIZATION *** //
const scene = new Scene();
const renderer = new WebGLRenderer({ antialias: true });
const camera = new PerspectiveCamera(75, 16 / 9, 0.1, 1000);
const fileCache = new FileCache();
const resourceTracker = new ResourceTracker();

// CAMERA //

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);

// LIGHT //
const hemiLight = new HemisphereLight(0xfffffff, 0x444444, 0.6);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// GROUN PLANE //
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

// SEGMENTS //
// ANIMATIONS //
const clock = new Clock();
// *** END: INITIALIZATION *** //

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

  // Map data to parent
  if (parent) {
    const split = parent.connection[0].split("_");
    split[0] = "male";
    const boneName = clone.userData[split.join("_")].split(".").join("");

    console.log(parent.bone);
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

  scene.add(clone);
  scene.add(helper);
  clone.visible = true;
  resourceTracker.track(clone);

  const connections = segment.connections2;
  Object.entries(connections).forEach((connection: any) => {
    const split = connection[0].split("_");
    if (split[0] === "female" && connection[1]) {
      console.log(segment, connection);
      const targetSegment = segmentMap[connection[1]];
      const boneName = clone.userData[connection[0]].split(".").join("");
      clone.traverse((obj3d: Object3D) => {
        if (obj3d instanceof SkinnedMesh) {
          const mesh = obj3d;
          const bone = obj3d.skeleton.getBoneByName(boneName);
          if (bone) {
            recursivelyConstructSegments(targetSegment, segmentMap, {
              segment,
              bone,
              mesh,
              connection,
            });
          }
        }
      });
    }
  });
};
// *** END: SEGMENTS *** //

// *** START: RENDER *** //
const render = async (
  container: HTMLDivElement,
  segmentMap: SegmentMap,
  options: any
) => {
  // Handle Files
  const segments = Object.values(segmentMap);
  const files = segments.map((segment: SegmentType) => {
    return segment.file;
  });
  await fileCache.updateFiles(files);

  resourceTracker.dispose();
  const bases = segments.filter((segment) => segment.type === "BASE");
  bases.forEach((base) => recursivelyConstructSegments(base, segmentMap));

  // Setup Canvas & Camera
  container.innerHTML = "";
  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  camera.position.z = 25;
  camera.position.y = 25;
  container.appendChild(renderer.domElement);

  controls.update();

  animate();
};
// *** END: RENDER *** //

const animate = () => {
  //const delta = clock.getDelta();
  //updateMixers(delta);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

export default render;
