import createSagaMiddleware, { Task } from "redux-saga";
import rootReducer, { RootState } from "./index";
import { configureStore } from "@reduxjs/toolkit";
import { watcherSaga } from "./sagas";

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(watcherSaga);

  return store;
};

export const store = makeStore();
export type AppDispatch = typeof store.dispatch;
