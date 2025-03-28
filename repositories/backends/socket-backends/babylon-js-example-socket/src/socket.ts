import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { IUseBabylonCharacterController } from '@wisdomstar94/react-babylon-utils';

const BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN = process.env.BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN ?? '';

export function socket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN.split(',').map((x) => x.trim()),
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      if (typeof jwtSecretKey !== 'string') {
        next(new Error('Authentication error..!'));
        return;
      }

      // Verify and decode the JWT
      const decoded = jwt.verify(token, jwtSecretKey);

      // Attach the user object to the socket
      socket.data.jwtPayload = decoded;
      next();
    } catch (error) {
      console.error('Authentication error', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('New client connected!!', socket.id);
    // const authData = socket.handshake.auth;
    const socketClientId = socket.data?.jwtPayload?.characterId;
    console.log('socketClientId', socketClientId);
    // if (typeof socketClientId !== 'string' || socketClientId?.trim() === '') {
    //   socket.disconnect();
    //   return;
    // }

    const totalSocketList = await io.fetchSockets();
    const targets = totalSocketList.filter((k) => k.data.jwtPayload?.characterId === socketClientId);
    for (const target of targets) {
      if (target.id !== socket.id) {
        delete target.data.jwtPayload;
        target.disconnect();
      }
    }

    socket.on('disconnect', () => {
      console.log('user disconnect', socket.id);
      // socket.broadcast.emit('otherUserDisconnect', { characterId: socket.data.jwtPayload.characterId });
    });

    socket.on('good', (data: any) => {
      console.log('on.good', data); // 클라이언트 -> 서버
    });

    socket.on('meConnect', (data: IUseBabylonCharacterController.AddRequireInfo) => {
      console.log('@meConnect', data.characterId);
      socket.data = { characterId: data.characterId };
      // console.log('@meConnect', socket);
      socket.broadcast.emit('otherUserConnect', data);
    });

    socket.on(
      'meCurrentPositionAndRotation',
      (data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) => {
        console.log('@meCurrentPositionAndRotation', data.characterId);
        socket.broadcast.emit('otherUserCurrentPositionAndRotation', data);
      }
    );

    socket.on('meCurrent', (params: { data: IUseBabylonCharacterController.AddRequireInfo; characterId?: string }) => {
      console.log('@meCurrent', params.data.characterId);
      if (params.characterId === undefined) {
        socket.broadcast.emit('otherUserCurrent', params.data);
      } else {
        console.log('## ## ##');
        io.fetchSockets().then((list) => {
          // console.log('@@list', list);
          const targetSocket = list.find((k) => k.data.characterId === params.characterId);
          // console.log('targetSocket', targetSocket);
          targetSocket?.emit('otherUserCurrent', params.data);
        });
      }
    });

    socket.on('meMoving', (data: IUseBabylonCharacterController.CharacterMovingOptions) => {
      console.log('@meMoving', data.characterId);
      socket.broadcast.emit('otherUserModelMovingInfo', data);
    });

    socket.on(
      'meJumping',
      (data: { characterId: string; jumpingOptions: IUseBabylonCharacterController.CharacterJumpingOptions }) => {
        console.log('@meJumping', data.characterId);
        socket.broadcast.emit('otherUserModelJumpingInfo', data);
      }
    );

    // setInterval(() => {
    //   socket.broadcast.emit('getOtherDatas', { timestemp: Date.now() });
    // }, 1000);

    // web rtc 관련
    socket.on('requestAllUsers', (data: { clientId: string }) => {
      console.log('@requestAllUsers', data);
      // socket.data.clientId = data.clientId;
      // console.log('@socket.data', socket.data);
      io.fetchSockets().then((res) => {
        socket.emit(
          'allUsers',
          res.map((x) => x.data.jwtPayload.characterId)
        );
      });
    });

    socket.on('requestOneUser', (data: { targetClientId: string }) => {
      io.fetchSockets().then((res) => {
        const isExist = res.find((k) => k.data.jwtPayload.characterId === data.targetClientId) !== undefined;
        socket.emit('oneUser', { clientId: data.targetClientId, isExist });
      });
    });

    socket.on('sendOffer', (data: { sdp: any; clientId: string; receiveId: string }) => {
      console.log('@@sendOffer', data);
      io.fetchSockets().then((sockets) => {
        const receiveSocket = sockets.find((k) => k.data.jwtPayload.characterId === data.receiveId);
        console.log('@@sendOffer.receiveSocket exist', receiveSocket !== undefined);
        receiveSocket?.emit('getOffer', data);
      });
    });

    socket.on('sendAnswer', (data: { sdp: any; clientId: string; receiveId: string }) => {
      console.log('@@sendAnswer', data);
      io.fetchSockets().then((sockets) => {
        const receiveSocket = sockets.find((k) => k.data.jwtPayload.characterId === data.receiveId);
        console.log('@@sendAnswer.receiveSocket exist', receiveSocket !== undefined);
        console.log('@@sendAnswer.receiveSocket.data', receiveSocket?.data);
        console.log(`@@sendAnswer.receiveSocket?.emit('getAnswer', data)`);
        receiveSocket?.emit('getAnswer', data);
      });
    });

    socket.on('sendCandidate', (data: { candidate: any; clientId: string; receiveId: string }) => {
      console.log('@@sendCandidate', data);
      io.fetchSockets().then((sockets) => {
        const receiveSocket = sockets.find((k) => k.data.jwtPayload.characterId === data.receiveId);
        receiveSocket?.emit('getCandidate', data);
      });
    });

    socket.on('applySendOffer', (data: { clientId: string; receiveId: string }) => {
      console.log('@@applySendOffer', data);
      io.fetchSockets().then((sockets) => {
        const targetSockets = sockets.filter(
          (k) => k.data.clientId === data.clientId || k.data.clientId === data.receiveId
        );
        const receiveSocket = targetSockets.find((k) => k.data.clientId === data.receiveId);
        const key1 = `${data.clientId}.${data.receiveId}`;
        const key2 = `${data.receiveId}.${data.clientId}`;

        const isAppliedSendOffer =
          targetSockets.find((k) => {
            return k.data[key1] === 'appliedSendOffer' || k.data[key2] === 'appliedSendOffer';
          }) !== undefined;

        console.log('@isAppliedSendOffer', isAppliedSendOffer);

        if (!isAppliedSendOffer) {
          targetSockets.forEach((s) => {
            s.data[key1] = 'appliedSendOffer';
            s.data[key2] = 'appliedSendOffer';
          });
          socket.emit('applySendOfferSuccess', data);
          receiveSocket?.emit('appliedSendOffer', data);
        }
      });
    });

    socket.on('successConnect', (data: { clientId: string; receiveId: string }) => {
      console.log('@@successConnect', data);
      io.fetchSockets().then((sockets) => {
        const targetSockets = sockets.filter(
          (k) => k.data.clientId === data.clientId || k.data.clientId === data.receiveId
        );
        const key1 = `${data.clientId}.${data.receiveId}`;
        const key2 = `${data.receiveId}.${data.clientId}`;
        targetSockets.forEach((s) => {
          s.data[key1] = '';
          s.data[key2] = '';
        });
      });
    });

    socket.on('sendPeerDisconnected', (data: { clientId: string; receiveId: string }) => {
      console.log('@sendPeerDisconnected', data);
      io.fetchSockets().then((sockets) => {
        const receiveSocket = sockets.find((k) => k.data.clientId === data.receiveId);
        receiveSocket?.emit('getPeerDisconnected', data);
      });
    });

    socket.on('sendSyncPeerDisconnected', (data: { clientId: string; receiveId: string }) => {
      console.log('@sendSyncPeerDisconnected', data);
      io.fetchSockets().then((sockets) => {
        const receiveSocket = sockets.find((k) => k.data.clientId === data.receiveId);
        console.log('@sendSyncPeerDisconnected.receiveSocket isExist', receiveSocket !== undefined);
        receiveSocket?.emit('getSyncPeerDisconnected', data);
      });
    });
  });
}
