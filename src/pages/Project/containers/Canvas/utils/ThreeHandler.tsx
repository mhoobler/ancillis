import {
  SkeletonHelper,
  Skeleton,
  Bone,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  MeshPhongMaterial,
  GridHelper,
  HemisphereLight,
  Color,
  Fog,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//@ts-ignore
import { GUI } from "./dat.gui.module.js";

import SocketSegment from "./Socket";

type XYZ = {
  x?: number;
  y?: number;
  z?: number;
};

class GlobalSkeleton {
  prevBone: Bone;
  bones: Bone[];
  skeleton: Skeleton;

  constructor(bonesArr?: Bone[]) {
    if (bonesArr) {
      this.prevBone = bonesArr[bonesArr.length - 1];
      this.bones = bonesArr;
      this.skeleton = new Skeleton(this.bones);

      return this;
    }
    this.prevBone = new Bone();
    this.bones = [this.prevBone];
    this.skeleton = new Skeleton(this.bones);

    return this;
  }

  addBone(pos: XYZ, rot?: XYZ) {
    const newBone = new Bone();
    newBone.position.x = pos.x ? pos.x : 0;
    newBone.position.y = pos.y ? pos.y : 0;
    newBone.position.z = pos.z ? pos.z : 0;
    this.prevBone.add(newBone);
    this.prevBone = newBone;
    this.bones.push(newBone);
    this.skeleton = new Skeleton(this.bones);
  }
}

class ThreeHandler {
  scene: Scene;
  skeleton: GlobalSkeleton;
  meshes: any[];
  renderer: WebGLRenderer;

  constructor(node: HTMLDivElement) {
    console.log("test");
    node.innerHTML = "";
    const rect = node.getBoundingClientRect();

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    const renderer = new WebGLRenderer();
    renderer.setSize(rect.width, rect.height);

    const groundGeo = new PlaneGeometry(500, 500);
    const groundMat = new MeshPhongMaterial({
      color: 0xdddddd,
      depthWrite: false,
    });
    const ground = new Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI * 0.5;
    ground.position.set(0, 0, 0);

    const grid = new GridHelper(500, 100, 0x000000, 0x000000);
    grid.position.y = 0;

    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    scene.background = new Color(0xdddddd);
    scene.fog = new Fog(0xdddddd, 100, 150);
    scene.add(ground);
    scene.add(grid);
    camera.position.z = 25;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();

    const animate = function () {
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 17);
      renderer.render(scene, camera);
    };
    animate();

    this.scene = scene;
    this.skeleton = new GlobalSkeleton();
    this.renderer = renderer;
    this.meshes = [];

    return this;
  }

  addSegment(type: string) {
    if (type === "SOCKET") {
      const socket = new SocketSegment(this);
      this.scene.add(socket.mesh);
    }
  }

  bindDiv(node: HTMLDivElement) {
    node.appendChild(this.renderer.domElement);
  }

  getHelpers() {
    for (let child of this.scene.children) {
      if (child.userData.type === "Segment") {
        const helper = new SkeletonHelper(child);
        //@ts-ignore
        helper.material.linewidth = 2;
        this.scene.add(helper);
      }
    }
  }

  getGui() {
    const gui = new GUI();

    for (let i = 0; i < this.skeleton.bones.length; i++) {
      const bone = this.skeleton.bones[i];

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
}

export default ThreeHandler;

export { GlobalSkeleton };
