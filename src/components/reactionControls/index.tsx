import React, { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { debounce } from 'lodash';

import { Slider } from '..';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { settingsSlice } from 'src/store/settings';

type ReactionForm = {
    threshold?: string;
    period?: string;
};

export const ReactionControls = () => {
    const dispatch = useAppDispatch();
    const { period, threshold } = useAppSelector((state) => state.settings);

    const updateSettings = useMemo(() => {
        return debounce((period?: number, threshold?: number) => {
            if (period !== undefined && !isNaN(period)) {
                dispatch(settingsSlice.actions.setPeriod(period));
            }
            if (threshold !== undefined && !isNaN(threshold)) {
                dispatch(settingsSlice.actions.setThreshold(threshold));
            }
        }, 300);
    }, [dispatch]);

    useEffect(() => {
        return () => {
            updateSettings.cancel();
        };
    }, [updateSettings]);

    const onSubmit = useCallback(
        ({ period, threshold }: ReactionForm) => {
            updateSettings(Number(period), Number(threshold));
        },
        [updateSettings]
    );

    return (
        <Form<ReactionForm>
            initialValues={{ threshold: `${threshold}`, period: `${period}` }}
            render={({ handleSubmit }) => (
                <>
                    <Slider
                        name="period"
                        label="Period (how long to hold onto messages)"
                        step={100}
                        min={1000}
                        max={5000}
                    />
                    <Slider
                        name="threshold"
                        label="Frequency of Reactions"
                        step={0.01}
                        min={0}
                        max={1}
                        minLabel="Always"
                        maxLabel="Never"
                        hideValue
                    />
                    <OnChange name="period">{handleSubmit}</OnChange>
                    <OnChange name="threshold">{handleSubmit}</OnChange>
                </>
            )}
            onSubmit={onSubmit}
        ></Form>
    );
};

export default ReactionControls;
