import { Bone, SphereGeometry, MeshBasicMaterial, SkinnedMesh } from "three";

import ThreeHandler from "./ThreeHandler";

class SocketSegment {
  geometry: SphereGeometry;
  material: MeshBasicMaterial;
  mesh: SkinnedMesh;
  bone: Bone;

  constructor(handler: ThreeHandler, targetBone?: Bone) {
    const { skeleton } = handler;

    const radius = 5;
    const prevBone = targetBone || skeleton.prevBone;
    this.geometry = new SphereGeometry(radius, 18, 8);
    this.material = new MeshBasicMaterial({ color: 0x00aaff });
    this.mesh = new SkinnedMesh(this.geometry, this.material);
    this.bone = prevBone;
    this.mesh.userData.type = "Segment";
    this.mesh.position.y = radius * 2 * skeleton.bones.length;

    this.mesh.add(prevBone);
    skeleton.addBone({ y: 5 });

    console.log(skeleton.bones);
    this.mesh.bind(skeleton.skeleton);
    console.log(skeleton);

    return this;
  }
}

export default SocketSegment;
