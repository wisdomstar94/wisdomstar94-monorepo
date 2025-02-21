'use client';

import {
  AnimationPropertiesOverride,
  HemisphericLight,
  LoadAssetContainerAsync,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
registerBuiltInLoaders();

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
          light2.intensity = 1;

          // glb 파일 로드 후 scene 에 추가하기
          const loadedAssetContainer = await LoadAssetContainerAsync('test-box.glb', scene, { rootUrl: '/' });
          loadedAssetContainer.addAllToScene();

          // cube mesh 찾고 property 일부 조정하기
          const importedMesh = scene.meshes.find((x) => x.id === 'Cube');
          if (importedMesh === undefined) throw new Error(`importedMesh not defined`);
          importedMesh.scaling.scaleInPlace(0.5);
          importedMesh.receiveShadows = true;

          // camera 설정
          const camera = new UniversalCamera('camera2', new Vector3(2, 2, 2), scene);
          camera.setTarget(new Vector3(0, 0, 0));

          // render
          engineInfo.engine.runRenderLoop(() => {
            scene.render();
          });
        }}
      />
    </div>
  );
}
