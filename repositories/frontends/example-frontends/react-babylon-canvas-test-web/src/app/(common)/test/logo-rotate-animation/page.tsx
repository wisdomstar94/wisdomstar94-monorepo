'use client';

import {
  AnimationPropertiesOverride,
  Color4,
  HemisphericLight,
  LoadAssetContainerAsync,
  MeshBuilder,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import anime from 'animejs';
registerBuiltInLoaders();

export default function Page() {
  return (
    <div className="w-[220px] aspect-video flex items-center justify-center content-center relative overflow-hidden bg-slate-200">
      <BabylonCanvas
        className="w-[200%] aspect-video shrink-0 grow-0"
        // enableAxesViewer={true}
        onLoaded={async (params) => {
          const { engineInfo, canvas, scene } = params;
          console.log('#BabylonCanvas.onLoaded', { engineInfo, canvas, scene });

          // scene 설정
          scene.shadowsEnabled = true;
          scene.clearColor = new Color4(0, 0, 0, 0);

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
          const loadedAssetContainer = await LoadAssetContainerAsync('sample-logo.glb', scene, { rootUrl: '/' });
          loadedAssetContainer.addAllToScene();

          // cube mesh 찾고 property 일부 조정하기
          const importedMesh = scene.meshes.find((x) => x.id === 'SampleLogo');
          if (importedMesh === undefined) throw new Error(`importedMesh not defined`);
          importedMesh.parent = null; // 이걸 해주지 않으면 x 축이 반대로 동작함.
          importedMesh.receiveShadows = true;
          importedMesh.scaling.scaleInPlace(0.2);
          console.log(importedMesh);

          // cube mesh 의 부모 mesh 지정하기
          const importedMeshParent = MeshBuilder.CreateBox('box', { width: 0.1, height: 0.1, depth: 0.1 }, scene);
          importedMeshParent.visibility = 0;
          importedMesh.parent = importedMeshParent;

          // animation 적용
          anime({
            targets: [importedMeshParent.rotation],
            y: Math.PI * 2,
            loop: true,
            duration: 4000,
            autoplay: true,
            easing: 'linear',
          });

          // camera 설정
          const camera = new UniversalCamera('camera2', new Vector3(1.5, 0, 0), scene);
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
