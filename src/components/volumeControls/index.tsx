import React, { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { debounce } from 'lodash';

import { Slider } from '../';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { settingsSlice } from 'src/store/settings';

type VolumeForm = {
    volume?: string;
};

export const VolumeControls = () => {
    const dispatch = useAppDispatch();
    const volume = useAppSelector((state) => state.settings.volume);

    const changeVolume = useMemo(() => {
        return debounce((volume: number) => {
            console.log(volume);
            dispatch(settingsSlice.actions.setVolume(volume));
        }, 300);
    }, [dispatch]);

    useEffect(() => {
        return () => {
            changeVolume.cancel();
        };
    }, [changeVolume]);

    const onSubmit = useCallback(
        ({ volume }: VolumeForm) => {
            if (!isNaN(Number(volume))) {
                changeVolume(Number(volume));
            }
        },
        [changeVolume]
    );

    return (
        <Form<VolumeForm>
            initialValues={{ volume: `${volume}` }}
            render={({ handleSubmit }) => (
                <>
                    <Slider
                        name="volume"
                        label="Volume"
                        step={0.01}
                        min={0}
                        max={1}
                    />
                    <OnChange name="volume">{handleSubmit}</OnChange>
                </>
            )}
            onSubmit={onSubmit}
        ></Form>
    );
};

export default VolumeControls;
