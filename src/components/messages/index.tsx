import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from 'src/store/hooks';
import styles from './messages.module.scss';
import { Message, ReactionType } from 'src/types';

function messageReactions(message: Message) {
    if (!message.reactions) {
        return [];
    }
    return (
        Object.entries(message.reactions)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, b]) => b)
            .map(([reactionName]) => reactionName as ReactionType)
    );
}

function hasReaction(message: Message) {
    return messageReactions(message).length > 0;
}

function reactionClasses(message: Message) {
    const obj: Record<string, boolean> = {};
    for (const reaction of messageReactions(message)) {
        obj[styles[reaction]] = true;
    }
    return obj;
}

export const Messages = () => {
    const messages = useAppSelector((state) => state.messages.messages);
    const lengths = useAppSelector((state) => state.messages.lengths);
    const threshold = useAppSelector((state) => state.settings.threshold);

    const expectedLength = useMemo(() => {
        if (lengths.length === 0) {
            return 0;
        }
        return lengths.reduce((a, b) => a + b) / lengths.length;
    }, [lengths]);

    return (
        <>
            {threshold !== undefined && (
                <div
                    className={styles.expectedLength}
                    style={
                        {
                            '--len': expectedLength * threshold,
                        } as React.CSSProperties
                    }
                ></div>
            )}
            <ul className={styles.messages}>
                {messages.map((msg) => (
                    <li
                        key={msg.id}
                        id={msg.id}
                        className={clsx({
                            [styles.reaction]: hasReaction(msg),
                            ...reactionClasses(msg),
                        })}
                    >
                        <i aria-hidden="true">
                            {msg.reactions?.laugh && '😂'}
                            {msg.reactions?.gasp && '😦'}
                            {msg.reactions?.cheer && '🙌'}
                            {msg.reactions?.boo && '😠'}
                            {msg.reactions?.applause && '👏'}
                        </i>
                        {msg.content}
                    </li>
                ))}
            </ul>
        </>
    );
};
