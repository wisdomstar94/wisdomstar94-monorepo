import { ActionManager, HavokPlugin, Scene, Vector3 } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

export function useGravity() {
  async function setGravity(params: { scene: Scene }) {
    const { scene } = params;
    scene.actionManager = new ActionManager(scene);
    const gravityVector = new Vector3(0, -19.81, 0);
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new HavokPlugin(undefined, havokInstance);
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.shadowsEnabled = true;
  }

  return {
    setGravity,
  };
}
