import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'src/types';

export interface MessagesState {
    messages: Message[];
    lengths: number[];
}

const initialState: MessagesState = {
    messages: [],
    lengths: [],
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages = [action.payload, ...state.messages];
            state.lengths = [state.messages.length, ...state.lengths].slice(
                0,
                100
            );
        },
        cullOldMessages: (state, action: PayloadAction<number>) => {
            const date = new Date();
            state.messages = state.messages.filter((x) => {
                return date.getTime() - x.time < action.payload;
            });
        },
    },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
