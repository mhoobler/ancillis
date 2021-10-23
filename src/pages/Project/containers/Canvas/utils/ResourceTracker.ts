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
        if (e instanceof Mesh || e instanceof SkeletonHelper) {
          const { geometry, material } = e;

          geometry.dispose();
          if (!Array.isArray(material)) {
            material.dispose();
          } else {
            material.forEach((e) => e.dispose());
          }
          obj.removeFromParent();
        }
      });
    }
  }
}

export default ResourceTracker;
