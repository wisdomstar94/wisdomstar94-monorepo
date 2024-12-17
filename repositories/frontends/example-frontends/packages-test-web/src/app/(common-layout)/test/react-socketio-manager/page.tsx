'use client';

import { usePromiseInterval } from '@wisdomstar94/react-promise-interval';
import { useSocketioManager } from '@wisdomstar94/react-socketio-manager';
import { useEffect, useState } from 'react';

type MyData = {
  name: string;
  t: number;
};

export default function Page() {
  const [number, setNumber] = useState(0);

  usePromiseInterval({
    intervalTime: 1000,
    fn: async () => {
      setNumber((prev) => prev + 1);
    },
    isAutoStart: true,
  });

  useEffect(() => {
    console.log('@number', number);
  }, [number]);

  const socketioManager = useSocketioManager<string>({
    baseUrl: 'localhost:3040',
    initializeAutoConnects: {
      items: [
        {
          namespace: '/',
        },
      ],
    },
    onConnected(namespace, socket) {
      console.log('@onConnected', { namespace, socket, number });
    },
    onDisconnected(namespace, socket, reason) {
      switch (reason) {
        case 'transport close':
          // 소켓 서버에서 소켓이 내려간 경우 (listen 하지 않는 경우)
          // 소켓 서버에서 io 내부에서 throw 에러가 발생한 경우
          // 네트워크 연결이 끊겨서 소켓 연결이 끊긴 경우
          break;
        case 'io server disconnect':
          // 서버 측에서 명시적으로 disconnect 한 경우
          break;
        case 'io client disconnect':
          // 클라이언트에서 명시적으로 disconnect 한 경우
          break;
        case 'transport error':
          break;
        case 'parse error':
          break;
        case 'ping timeout':
          break;
      }

      console.log('@onDisconnected', { namespace, socket, reason, number });
    },
  });

  socketioManager.setListener({
    namespace: '/',
    eventName: 'my-event',
    callback(data: MyData) {
      console.log('@@@ my-event!!!', data);
      console.log('@@@ my-event!!! data.name', data.name);
      console.log('@@@ my-event!!! data.t', data.t);
      console.log('@@@ component.number!!!', number);
    },
  });

  socketioManager.setListener({
    namespace: '/users',
    eventName: 'user:list',
    callback(data) {
      console.log('@@@ user:list!!!', data);
      console.log('@@@ component.number!!!', number);
    },
  });

  // useEffect(() => {
  //   const s = socketioManager.manager.socket('/');

  // }, [socketioManager.manager]);

  return (
    <>
      <button
        onClick={() => {
          socketioManager.connect({
            namespace: '/',
            options: {},
          });
        }}
      >
        / 소켓 연결하기
      </button>
      <button
        onClick={() => {
          socketioManager.disconnect({
            namespace: '/',
          });
        }}
      >
        / 소켓 연결 해제하기
      </button>
      <button
        onClick={() => {
          socketioManager.connect({
            namespace: '/users',
          });
        }}
      >
        /users 소켓 연결하기
      </button>
      <button
        onClick={() => {
          socketioManager.disconnect({
            namespace: '/users',
          });
        }}
      >
        /users 소켓 연결 해제하기
      </button>
      <button
        onClick={() => {
          socketioManager.emit({
            namespace: '/users',
            eventName: 'user-event',
            data: {
              from: 'client',
              age: 11,
            },
          });
        }}
      >
        /users 소켓에 이벤트 보내기
      </button>
      <button
        onClick={() => {
          socketioManager.allConnectConnectItems();
        }}
      >
        allConnectConnectItems
      </button>
      <button
        onClick={() => {
          socketioManager.allDisconnectConnectItems();
        }}
      >
        allDisconnectConnectItems
      </button>
      <button
        onClick={() => {
          socketioManager.allDisconnectConnectItems(true);
        }}
      >
        allDisconnectConnectItems with removeInConnectItems
      </button>
      <button
        onClick={() => {
          console.log(`socketioManager.isConnected('/')`, socketioManager.isConnected('/'));
        }}
      >
        / 연결되었나?
      </button>
      <button
        onClick={() => {
          console.log(`socketioManager.isConnected('/users')`, socketioManager.isConnected('/users'));
        }}
      >
        /users 연결되었나?
      </button>
    </>
  );
}
