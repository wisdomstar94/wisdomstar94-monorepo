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

export function useRotatePlane() {
  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  function settingShadow(params: { mesh: AbstractMesh; shadowGenerator: ShadowGenerator }) {
    const { mesh, shadowGenerator } = params;
    mesh.receiveShadows = true;
    const shadowMap = shadowGenerator.getShadowMap();
    shadowMap?.renderList?.push(mesh);
  }

  function addRotatePlane(params: { scene: Scene; shadowGenerator: ShadowGenerator }) {
    const { scene, shadowGenerator } = params;

    babylonMeshPhysicsManager.injectObject({
      manageName: 'rotate-plane',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 10, height: 0.1, depth: 2 }, scene); // width == x, height == y, depth == z
        mesh.position.y = 1.2;
        mesh.position.x = 10;
        mesh.position.z = 4;
        mesh.rotation.z = Math.PI / 8;
        settingShadow({ mesh, shadowGenerator });
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(new Vector3(0, 0, 0), Quaternion.Identity(), new Vector3(10, 0.1, 2), scene);
        body.setMassProperties({ mass: 0.1 });
        body.transformNode.rotation.z = Math.PI / 8;
        return body;
      },
    });
  }

  return {
    addRotatePlane,
  };
}
