import {
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

const useThree = (segments: SegmentType[], options: any) => {
  // TODO: change how this works so we can allow more advanced segments
  // Basically whole thing needs to change
  const constructSkeleton = () => {
    let prevBone = new Bone();
    prevBone.position.y = 0;
    const bones = [prevBone];

    for (let i = 0; i < segments.length; i++) {
      const newBone = new Bone();
      newBone.position.y = 10;
      prevBone.add(newBone);
      bones.push(newBone);
      prevBone = newBone;
    }
    bones[0].position.y = -10 * (segments.length - 1);
    return new Skeleton(bones);
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
  const renderMeshes = (scene: Scene, skeleton: Skeleton) => {
    for (let i = 0; i < segments.length; i++) {
      const geometry = skinGeometry(new SphereGeometry(5, 16, 8), i);
      const material = new MeshBasicMaterial({ color: 0x00aaff });
      const mesh = new SkinnedMesh(geometry, material);
      mesh.position.y = 10 * i;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);
      console.log(mesh);
      scene.add(mesh);
    }
  };

  const init = (container: HTMLDivElement) => {
    console.log("init");
    const rect = container.getBoundingClientRect();
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    renderer.setSize(rect.width, rect.height);
    const camera = new PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.z = 25;

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
    controls.update();

    container.appendChild(renderer.domElement);
    const skeleton = constructSkeleton();
    const helper = new SkeletonHelper(skeleton.bones[0]);
    scene.add(helper);
    renderMeshes(scene, skeleton);

    if (options.gui) {
      const gui = new GUI();

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
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

  return { init };
};

export default useThree;
