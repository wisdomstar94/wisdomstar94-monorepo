import {
  AbstractMesh,
  Color3,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  Quaternion,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { useBabylonMeshPhysicsManager } from '@wisdomstar94/react-babylon-utils';

export function useGround() {
  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  function settingShadow(params: { mesh: AbstractMesh; shadowGenerator: ShadowGenerator }) {
    const { mesh, shadowGenerator } = params;
    mesh.receiveShadows = true;
    const shadowMap = shadowGenerator.getShadowMap();
    shadowMap?.renderList?.push(mesh);
  }

  function addGround(params: { scene: Scene; shadowGenerator: ShadowGenerator }) {
    const { scene, shadowGenerator } = params;

    babylonMeshPhysicsManager.injectObject({
      manageName: 'ground',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 40, height: 2, depth: 40 }, scene);
        mesh.position.y = -1;

        const groundMaterial = new StandardMaterial('ground', scene);
        // groundMaterial.ambientColor = new Color3(1, 1, 1);
        groundMaterial.specularColor = new Color3(0, 0, 0);
        groundMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2);
        groundMaterial.useLightmapAsShadowmap = true;
        mesh.material = groundMaterial;

        settingShadow({ mesh, shadowGenerator });
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(new Vector3(0, 0, 0), Quaternion.Identity(), new Vector3(40, 2, 40), scene);
        body.setMassProperties({ mass: 0.1 });
        return body;
      },
    });
  }

  return {
    addGround,
  };
}
