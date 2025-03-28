import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { IBabylonCanvas } from './babylon-canvas.interface';
import { useEffect, useRef, useState } from 'react';
import { AxesViewer, Engine, Scene, WebGPUEngine } from '@babylonjs/core';

export function BabylonCanvas(props: IBabylonCanvas.Props) {
  const { applyAxesViewer, onReady } = props;
  const isDisableWebGPU = props.isDisableWebGPU ?? false;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enginesRef = useRef<IBabylonCanvas.Engines | undefined>(undefined);
  const sceneRef = useRef<Scene | undefined>(undefined);

  const [isReady, setIsReady] = useState(false);
  const [isReadyed, setIsReadyed] = useState(false);

  function onEngines(engines: IBabylonCanvas.Engines) {
    if (canvasRef.current === null) throw new Error(`canvas element not init!`);

    if (typeof onReady === 'function') {
      const scene = new Scene(engines.engine);

      let axesViewer: AxesViewer | undefined;
      if (applyAxesViewer?.enable === true) {
        axesViewer = new AxesViewer(
          scene,
          applyAxesViewer.scaleSize,
          undefined,
          undefined,
          undefined,
          undefined,
          applyAxesViewer.lineThicknessSize ?? 0.1
        );
      }

      sceneRef.current = scene;
      onReady({
        engines,
        scene,
        canvas: canvasRef.current,
        axesViewer,
      });
    }
    setIsReadyed(true);
  }

  useEffect(() => {
    if (isReadyed !== true) return;

    enginesRef.current?.engine.runRenderLoop(() => {
      if ((sceneRef.current?.cameras.length ?? 0) >= 1) {
        sceneRef.current?.render();
      }
    });

    return () => {
      sceneRef.current?.dispose();
      enginesRef.current?.engine.dispose();
    };
  }, [isReadyed]);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'resize',
      eventListener(event) {
        enginesRef.current?.engine.resize();
      },
    },
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas === null || canvas === undefined) return;
    if (isReady !== true) return;

    const onWebGPU = () => {
      const engine = new WebGPUEngine(canvas);
      enginesRef.current = { engine };
      enginesRef.current.webGPUEngine = engine;
      engine.initAsync().then(() => {
        onEngines({ webGPUEngine: engine, engine });
      });
    };

    const onWebGL = () => {
      const engine = new Engine(canvas);
      enginesRef.current = { engine };
      enginesRef.current.webGLEngine = engine;
      onEngines({ webGLEngine: engine, engine });
    };

    if (isDisableWebGPU) {
      onWebGL();
    } else {
      WebGPUEngine.IsSupportedAsync.then((isSupported) => {
        if (isSupported) {
          onWebGPU();
        } else {
          onWebGL();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    // resizeCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    enginesRef.current?.engine.resize();
  }, [isReadyed]);

  return (
    <>
      <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef}></canvas>
    </>
  );
}
