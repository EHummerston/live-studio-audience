import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';
import { throttle } from 'lodash';

import { testReactionType } from './utils/testReactionType';
import { Message, ReactionType } from './types';
import * as assets from './assets';
import {
    ChannelForm,
    Messages,
    ReactionControls,
    VolumeControls,
} from './components';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { messagesSlice } from './store/messages';
import { useIrc } from './hooks/useIrc';

type ChannelForm = {
    channel?: string;
};

function playSound(reaction: ReactionType) {
    let asset: (() => void) | undefined = undefined;
    switch (reaction) {
        case ReactionType.laugh:
            asset = assets.laugh;
            break;
        case ReactionType.applause:
            asset = assets.applause;
            break;
    }

    if (!asset) {
        return;
    }

    asset();
}

function App() {
    const dispatch = useAppDispatch();
    const { volume, period, threshold } = useAppSelector(
        (state) => state.settings
    );
    const messages = useAppSelector((state) => state.messages.messages);
    const lengths = useAppSelector((state) => state.messages.lengths);
    useEffect(() => {
        Howler.volume(volume);
    }, [volume]);

    const channel = useAppSelector((state) => state.channel.name);

    const [reactions, setReactions] = useState<string[]>([]);

    const messageCallback = useCallback(
        (message: string) => {
            const date = new Date();
            const msg: Message = {
                content: message,
                id: `${date.valueOf()}`,
                reactions: {
                    laugh: testReactionType(message, ReactionType.laugh),
                    cheer: testReactionType(message, ReactionType.cheer),
                    gasp: testReactionType(message, ReactionType.gasp),
                    boo: testReactionType(message, ReactionType.boo),
                    applause: testReactionType(message, ReactionType.applause),
                },
                time: date.getTime(),
            };

            dispatch(messagesSlice.actions.addMessage(msg));
            dispatch(messagesSlice.actions.cullOldMessages(period));
        },
        [dispatch, period]
    );

    useIrc(channel, messageCallback);

    const checkReactions = useCallback(
        (messages: Message[], expectedLength: number) => {
            for (const r of Object.keys(ReactionType)) {
                const reaction = ReactionType[r as ReactionType];

                if (
                    messages.filter((x) => x.reactions && x.reactions[reaction])
                        .length >
                    expectedLength * threshold
                ) {
                    playSound(reaction);
                    const log = `
                    [${reaction.toUpperCase()}]
                    ${channel} 
                    ${new Date().toTimeString()}
                    ${new Date().getTime()}
                    `;
                    setReactions((curr) => [log, ...curr].slice(0, 30));
                }
            }
        },
        [channel, threshold]
    );

    const throttledCheck = useMemo(
        () =>
            throttle(checkReactions, 500, {
                leading: true,
                trailing: true,
            }),
        [checkReactions]
    );

    useEffect(() => {
        return () => {
            throttledCheck.cancel();
        };
    }, [throttledCheck]);

    const expectedLength = useMemo(() => {
        if (lengths.length === 0) {
            return 0;
        }
        return lengths.reduce((a, b) => a + b) / lengths.length;
    }, [lengths]);

    useEffect(() => {
        throttledCheck(messages, expectedLength);
    }, [throttledCheck, messages, expectedLength]);

    return (
        <div className="App">
            <ChannelForm />
            <hr />
            <div className="panel">
                <Messages />
            </div>
            <hr />
            <div className="panel">
                <ul className="reaction-log">
                    {reactions.map((r) => (
                        <li key={r}>{r}</li>
                    ))}
                </ul>
            </div>
            <hr />
            <div className="panel">
                <VolumeControls />
                <ReactionControls />
            </div>
        </div>
    );
}

export default App;
