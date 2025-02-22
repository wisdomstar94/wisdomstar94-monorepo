'use client';

import {
  AnimationPropertiesOverride,
  Color3,
  Constants,
  GlowLayer,
  HemisphericLight,
  MeshBuilder,
  SpotLight,
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
          light2.intensity = 0.2;

          const light = new SpotLight('SpotLight', new Vector3(0, 2, 0), new Vector3(0, -1, 0), Math.PI * 2, 5, scene);
          light.range = 100;
          light.diffuse = new Color3(1, 0, 0);
          light.specular = new Color3(1, 0, 0);
          light.intensity = 5;

          // create mesh
          const mesh = MeshBuilder.CreateBox('box', { width: 0.7, height: 0.7, depth: 0.7 }, scene);
          mesh.position.x = 0;
          mesh.position.y = 0.4;

          const redMaterial = new StandardMaterial('m1', scene);
          redMaterial.emissiveColor = new Color3(255, 0, 0);
          mesh.material = redMaterial;

          // floor
          const floor = MeshBuilder.CreateBox('Floor', { width: 5, height: 0.2, depth: 5 }, scene);
          floor.receiveShadows = true;

          // camera 설정
          const camera = new UniversalCamera('camera2', new Vector3(5, 5, 5), scene);
          camera.setTarget(new Vector3(0, 0, 0));
          camera.attachControl(canvas, true);

          // bloom 설정
          // new BloomEffect(engineInfo.engine, 10, 5, 5);
          const gl = new GlowLayer('glow', scene, {
            mainTextureFixedSize: 256,
            blurKernelSize: 68,
            mainTextureSamples: 4,
            mainTextureRatio: 1270,
            ldrMerge: true,
            alphaBlendingMode: Constants.ALPHA_MAXIMIZED,
            camera,
          });
          // 특정 메시에만 bloom 적용하고 싶을 때
          gl.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
            if (mesh.name === 'box') {
              result.set(1, 0, 0, 1); // bloom 색상 및 투명도 지정
            } else {
              result.set(0, 0, 0, 0); // bloom 색상 및 투명도 지정
            }
          };

          // render
          engineInfo.engine.runRenderLoop(() => {
            scene.render();
          });
        }}
      />
    </div>
  );
}
