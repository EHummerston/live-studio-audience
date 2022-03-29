import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as storage from '../../utils/storage';

export interface SettingsState {
    volume: number;
    threshold: number;
    period: number;
}

const initialState: SettingsState = {
    volume: storage.get('volume') ?? 0.5,
    threshold: storage.get('threshold') ?? 0.75,
    period: storage.get('period') ?? 3000,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
            storage.set('volume', action.payload);
        },
        setThreshold: (state, action: PayloadAction<number>) => {
            state.threshold = action.payload;
            storage.set('threshold', action.payload);
        },
        setPeriod: (state, action: PayloadAction<number>) => {
            state.period = action.payload;
            storage.set('period', action.payload);
        },
    },
});

export const { setPeriod, setThreshold, setVolume } = settingsSlice.actions;

export default settingsSlice.reducer;
