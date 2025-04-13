import { DirectionalLight, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';

export function useLight() {
  function addLight(params: { scene: Scene }) {
    const { scene } = params;
    const hemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.2;

    const directionalLight = new DirectionalLight('dirLight', new Vector3(0, -1, 1), scene);
    directionalLight.position.z = -22;
    directionalLight.position.x = 22;
    directionalLight.position.y = 20;
    directionalLight.intensity = 0.7;
    directionalLight.shadowMinZ = 10;
    directionalLight.shadowMaxZ = 450;
    directionalLight.setDirectionToTarget(new Vector3(-1, 0, 1));

    return {
      hemisphericLight,
      directionalLight,
    };
  }

  return {
    addLight,
  };
}
