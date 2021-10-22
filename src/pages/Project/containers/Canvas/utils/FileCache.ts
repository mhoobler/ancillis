import { Bone, SkinnedMesh, Skeleton } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//@ts-ignore
import test_base from "./test_base.gltf";
//@ts-ignore
import test_limb from "./test_limb.gltf";
//@ts-ignore
import rotor_plate from "./rotor_plate.gltf";
//@ts-ignore
import rotor_cylinder from "./rotor_cylinder.gltf";

const fileNames: any = {
  "test_base.gltf": test_base,
  "test_limb.gltf": test_limb,
  "rotor_plate.gltf": rotor_plate,
  "rotor_cylinder.gltf": rotor_cylinder,
};

class FileCache extends Map {
  loader: GLTFLoader;

  constructor() {
    super();
    this.loader = new GLTFLoader();
  }

  // TODO: Prevent double fetch on double render
  fetchFile = (name: string) => {
    return new Promise((resolve, reject) => {
      this.loader.load(
        fileNames[name],
        (gltf) => {
          console.log(gltf);
          const data = gltf.scene.children[0];
          this.set(name, data);
          resolve(data);
        },
        () => {},
        (error) => {
          throw console.error(error);
        }
      );
    });
  };

  getClone = (name: string) => {
    if (!this.has(name)) {
      throw new Error(`file of ${name} has not been cached`);
    }

    const clone = this.get(name).clone();
    clone.visible = false;
    const cloneBones: any = {};
    const cloneMeshes: any = [];

    clone.traverse((e: any) => {
      if (e instanceof Bone) {
        cloneBones[e.name] = e;
      }
      if (e instanceof SkinnedMesh) {
        cloneMeshes.push(e);
      }
    });

    cloneMeshes.forEach((e: any) => {
      const newBones = e.skeleton.bones.map((e: any) => {
        const b = cloneBones[e.name];
        return b;
      });
      const n = new Skeleton(newBones, e.skeleton.boneInverses);
      e.bind(n, e.matrixWorld);
    });

    return clone;
  };

  untrack(name: string) {
    this.delete(name);
  }

  updateFiles = async (names: string[]) => {
    // Mark all resources
    const markedForDelete = new Set(this.keys());
    // Remove marks for resources we're using
    for (const name in names) {
      markedForDelete.delete(name);
    }
    // Delete unused resources
    for (const key in markedForDelete) {
      this.delete(key);
    }

    // Fetch new resources
    const namesToFetch = names.filter((name) => !markedForDelete.has(name));
    const fetching = namesToFetch.map((name) => this.fetchFile(name));
    await Promise.all(fetching);

    return this;
  };
}

export default FileCache;
