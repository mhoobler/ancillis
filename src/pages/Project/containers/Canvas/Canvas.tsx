import { FC, useCallback } from "react";
import * as THREE from "three";

const Canvas: FC = () => {
  const createScene = useCallback((node: HTMLDivElement) => {
    if (node) {
      const rect = node.getBoundingClientRect();
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(
        75,
        rect.width / rect.height,
        0.1,
        1000
      );
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(rect.width, rect.height);
      node.appendChild(renderer.domElement);
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;
      var animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    }
    return node;
  }, []);

  return <div ref={createScene} className="canvas-wrapper"></div>;
};

export default Canvas;
