import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/users.slice';
import productReducer from './slices/products.slice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;