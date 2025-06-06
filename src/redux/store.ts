import { configureStore } from "@reduxjs/toolkit";
import courtsReducer from "./features/courtsSlice";

const store = configureStore({
  reducer: {

    courts: courtsReducer, // Añade el reducer de canchas
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;