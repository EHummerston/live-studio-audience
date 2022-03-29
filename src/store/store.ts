import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import channelReducer from './channel';
import messagesReducer from './messages';
import settingsReducer from './settings';

export const store = configureStore({
    reducer: {
        channel: channelReducer,
        messages: messagesReducer,
        settings: settingsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
