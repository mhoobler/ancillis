import { SkinnedMesh } from "three";

class ResourceTracker {
  resources: Set<SkinnedMesh>;

  constructor() {
    this.resources = new Set();
  }

  track(obj: SkinnedMesh) {
    this.resources.add(obj);
    console.log(this.resources);
  }

  untrack(obj: SkinnedMesh) {
    this.resources.delete(obj);
  }

  dispose() {
    const resources = Array.from(this.resources.values());
    for (let obj of resources) {
      const { geometry, material } = obj;

      geometry.dispose();
      if (!Array.isArray(material)) {
        material.dispose();
      } else {
      }
      obj.removeFromParent();
    }
    //this.resources.clear();
  }
}

export default ResourceTracker;
