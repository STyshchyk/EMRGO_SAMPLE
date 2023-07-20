import { eventChannel as EventChannel } from "redux-saga";
import { call, put, take } from "redux-saga/effects";
import io from "socket.io-client";

import appConfig from "../../appConfig";

export function connect(namespace) {
  const socketIO = io(appConfig.baseAPIURL + namespace);
  // const socketIO = io('localhost:3002/' + namespace);
  return new Promise((resolve) => {
    socketIO.on("connect", () => {
      resolve(socketIO);
    });
  });
}

function subscribe(socket, actionCreator, module) {
  return new EventChannel((emit) => {
    socket.on("notification", (data) => emit(actionCreator(data)));

    socket.on("messages", (data) => emit(actionCreator(data)));

    // if (module === 'auction') {}
    // if (module === 'preauction') {}

    switch (module) {
      case "preauction":
        // Pre Auction Events
        socket.on("New", (data) => emit(actionCreator({ data, event: "UPDATE" })));
        break;

      case "auction":
        // Auction Events
        socket.on("New", (data) => emit(actionCreator({ data, event: "NEW" })));

        socket.on("Update", (data) => emit(actionCreator({ data, event: "UPDATE" })));
        break;
      default:
        // TODO: not sure about default behaviour
        break;
    }
    return () => {};
  });
}

export function* read(socket, actionCreator, module = "general") {
  const channel = yield call(subscribe, socket, actionCreator, module);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function subscribeToRoom(socket, roomID) {
  socket.emit("subscribe_to_room", { room: roomID });
}
