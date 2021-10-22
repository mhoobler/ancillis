import { Mesh, SkinnedMesh, SkeletonHelper } from "three";

class ResourceTracker {
  resources: Set<SkinnedMesh | SkeletonHelper>;

  constructor() {
    this.resources = new Set();
  }

  track(obj: any) {
    this.resources.add(obj);
  }

  untrack(obj: any) {
    this.resources.delete(obj);
  }

  dispose() {
    const resources = Array.from(this.resources.values());
    for (const obj of resources) {
      obj.traverse((e) => {
        if (e instanceof Mesh) {
          const { geometry, material } = e;

          geometry.dispose();
          if (!Array.isArray(material)) {
            material.dispose();
          } else {
          }
          obj.removeFromParent();
        }
      });
    }
    // for (let obj of resources) {
    //   const { geometry, material } = obj;

    //   geometry.dispose();
    //   if (!Array.isArray(material)) {
    //     material.dispose();
    //   } else {
    //   }
    //   obj.removeFromParent();
    // }
    // this.resources.clear();
  }
}

export default ResourceTracker;
