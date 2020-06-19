import { AsyncStorage } from "react-native";
import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import auth from "@feathersjs/authentication-client";
import socketio from "@feathersjs/socketio-client";
import feathersRest from "@feathersjs/rest-client";

const URL = "https://api.cityprime.club";
// const URL = 'http://192.168.1.12:3032';
export const socket = io(URL, {
  // transports: ['websocket'],
  forceNew: true
});

export const app = feathers();
export const rest = feathers();

app.configure(socketio(socket));
app.configure(
  auth({
    storage: AsyncStorage,
    jwtStrategy: "jwt"
  })
);

app.timeout = 10000;

rest.configure(feathersRest(URL).fetch(fetch));
rest.configure(
  auth({
    storage: AsyncStorage
  })
);
