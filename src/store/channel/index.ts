import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChannelState {
    name?: string;
}

const initialState: ChannelState = {
    name: window.location.hash.substring(1),
};

export const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string | undefined>) => {
            state.name = action.payload;
        },
    },
});

export const { setName } = channelSlice.actions;

export default channelSlice.reducer;
