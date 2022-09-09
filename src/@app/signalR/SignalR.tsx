import React, { useState, useEffect } from 'react';
import { HubConnection } from '@microsoft/signalr';
import signalR from './hub';

const SignalR = () => {
  const [connection, setConnection] = useState<HubConnection>();
  const token: string = signalR.getTK();

  useEffect(() => {
    const newConnection = signalR.connectionServer(token);
    newConnection
      .start()
      .then(() => {
        ('Connected');
      })
      .catch((mess) => {});
    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (connection) {
      // const response = httpClient.get({
      //   url: 'http://202.78.227.174/api/Notification'
      // });;
      //  (response)
      // signalR.receiveSignal();
      // connection
      //   .start()
      //   .then(()=>{
      //     connection.on("PrivateReceive",mess=>{
      //        (mess);
      //       // signalrServices(mess);
      //     })
      //     connection.on("PublicReceive",mess=>{
      //       //signalrServices(mess);
      //        (mess);
      //     })
      //   })
      //   .catch((err) =>  (err));
    }
  }, [connection]);

  return <></>;
};

export default SignalR;
