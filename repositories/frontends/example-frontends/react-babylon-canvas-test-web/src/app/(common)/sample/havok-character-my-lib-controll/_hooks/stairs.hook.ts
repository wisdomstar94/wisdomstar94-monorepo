import {
  AbstractMesh,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  Quaternion,
  Scene,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import { useBabylonMeshPhysicsManager } from '@wisdomstar94/react-babylon-utils';

export function useStairs() {
  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  function settingShadow(params: { mesh: AbstractMesh; shadowGenerator: ShadowGenerator }) {
    const { mesh, shadowGenerator } = params;
    mesh.receiveShadows = true;
    const shadowMap = shadowGenerator.getShadowMap();
    shadowMap?.renderList?.push(mesh);
  }

  function addStairs(params: { scene: Scene; shadowGenerator: ShadowGenerator }) {
    const { scene, shadowGenerator } = params;

    Array.from({ length: 10 }).forEach((_, index) => {
      babylonMeshPhysicsManager.injectObject({
        manageName: `stairs-${index}`,
        mesh: (params) => {
          const { manageName } = params;
          const mesh = MeshBuilder.CreateBox(manageName, { width: 2, height: 0.1, depth: 2 }, scene); // width == x, height == y, depth == z
          mesh.position.y = 1.2 + index * 1;
          mesh.position.x = 0 - index * 1;
          mesh.position.z = 4;
          settingShadow({ mesh, shadowGenerator });
          return mesh;
        },
        physicsBody: (params) => {
          const { mesh } = params;
          const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
          body.shape = new PhysicsShapeBox(new Vector3(0, 0, 0), Quaternion.Identity(), new Vector3(2, 0.1, 2), scene);
          body.setMassProperties({ mass: 0.1 });
          return body;
        },
      });
    });
  }

  return {
    addStairs,
  };
}
