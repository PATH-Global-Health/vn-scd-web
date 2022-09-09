import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

var connection: HubConnection;
interface token {
  access_token: string;
}
const getStorage = (key: string): string =>
  (localStorage.getItem(key) || sessionStorage.getItem(key)) ?? 'null';

const getTK = () => {
  const itemStr = getStorage('TOKEN');
  if (!itemStr) return '';
  const tk: token = JSON.parse(itemStr);
  return tk?.access_token ?? '';
};

const connectionServer = (token: string) => {
  const newConnection = new HubConnectionBuilder()
    .withUrl('http://202.78.227.174:12345/notificationHub', {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
  connection = newConnection;
  return newConnection;
};

const receiveSignal = async () => {
  if (connection) {
    connection
      .start()
      .then((rs) => {
        ('Connected');
        // connection.on('UserConnected', (mess: any) => {
        //    (mess);
        // });
        // connection.on('PublicReceive', (mess: any) => {
        //   signalrService(mess);
        // });
        // connection.on('PrivateReceive', (mess: any) => {
        //   signalrService(mess);
        // });
      })
      .catch((err) => err);
  }
};

// const receiveSignalR = async () => {
//   if(connection){
//     return connection.start().then(()=>connection)
//   }
// }

// const sendSignal = async (signalRModel:signalRModel) => {
//   if (connection) {
//     try {
//       await connection.send(signalRModel.typeMessage, signalRModel);
//     } catch (error) {
//        (error);
//     }
//   }
// };

const signalR = {
  connectionServer,
  // sendSignal,
  receiveSignal,
  // receiveSignalR,
  getTK,
};

export default signalR;
