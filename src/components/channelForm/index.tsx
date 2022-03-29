import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { channelSlice } from 'src/store/channel';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

type ChannelForm = {
    channel?: string;
};

export const ChannelForm = () => {
    const dispatch = useAppDispatch();
    const channelName = useAppSelector((state) => state.channel.name);

    const submit = useCallback(
        (form: ChannelForm) => {
            dispatch(channelSlice.actions.setName(form.channel));
            window.location.hash = form.channel ?? '';
        },
        [dispatch]
    );

    return (
        <Form<ChannelForm>
            initialValues={{ channel: channelName }}
            onSubmit={submit}
            render={({ handleSubmit }) => (
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                <form onSubmit={handleSubmit}>
                    <label htmlFor="channelName">Channel Name: </label>
                    <Field id="channelName" name="channel" component="input" />
                    <button type="submit">go</button>
                </form>
            )}
        />
    );
};

export default ChannelForm;
