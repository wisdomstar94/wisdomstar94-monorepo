'use client';

import {
  ActionManager,
  AnimationPropertiesOverride,
  Color3,
  ExecuteCodeAction,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';

export default function Page() {
  return (
    <div className="w-full relative">
      <BabylonCanvas
        className="w-[50%] aspect-square bg-slate-200"
        enableAxesViewer={true}
        onLoaded={async (params) => {
          const { engineInfo, canvas, scene } = params;
          console.log('#BabylonCanvas.onLoaded', { engineInfo, canvas, scene });

          // scene 설정
          scene.shadowsEnabled = true;

          // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
          if (scene.animationPropertiesOverride === null) {
            scene.animationPropertiesOverride = new AnimationPropertiesOverride();
            scene.animationPropertiesOverride.enableBlending = true;
            scene.animationPropertiesOverride.blendingSpeed = 0.05;
          }

          // 전반적인 빛
          const light2 = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
          light2.intensity = 0.7;

          // create mesh
          const mesh = MeshBuilder.CreateBox('box', { width: 0.3, height: 0.3, depth: 0.3 }, scene);
          mesh.position.x = 0;
          // mesh.scaling.scaleInPlace(0.2);
          // mesh.rotation.y = Math.PI / 4;

          // camera 설정
          const camera = new UniversalCamera('camera2', new Vector3(2, 2, 2), scene);
          camera.setTarget(new Vector3(0, 0, 0));

          // event 설정
          const actionManager = new ActionManager(scene);
          mesh.actionManager = actionManager;

          const redMaterial = new StandardMaterial('m1', scene);
          redMaterial.emissiveColor = new Color3(255, 0, 0);

          const greenMaterial = new StandardMaterial('m2', scene);
          greenMaterial.emissiveColor = new Color3(0, 255, 0);

          actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function () {
              mesh.material = redMaterial;
            })
          );
          actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function () {
              mesh.material = greenMaterial;
            })
          );
          actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickDownTrigger, function () {
              alert('');
            })
          );

          // render
          engineInfo.engine.runRenderLoop(() => {
            scene.render();
          });
        }}
      />
    </div>
  );
}
