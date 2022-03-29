import React from 'react';

// matches:
//  :<user>!<user>@<user>.tmi.twitch.tv PRIVMSG #<channel> :
const regx = /:\S+!\S+@\S+ PRIVMSG #\S+ :/;

export function useIrc(
    channel: string | undefined,
    messageCallback: (message: string) => unknown
) {
    React.useEffect(() => {
        if (!channel) {
            return () => void 0;
        }

        const connection = new WebSocket('wss://irc-ws.chat.twitch.tv/');

        // Connection opened
        connection.addEventListener('open', function () {
            connection.send(
                `NICK justinfan${(Math.random() * 1000 + 1000).toFixed(0)}`
            );
            connection.send(`JOIN #${channel.toLowerCase()}`);
        });

        // Listen for messages
        connection.addEventListener('message', function (event) {
            const message = event.data as string;
            console.debug('RECIEVE ', message);

            if (regx.test(message)) {
                messageCallback(message.replace(regx, ''));
            }
        });

        // PING
        const interval = setInterval(() => {
            if (connection) {
                connection.send('PING');
            }
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
            connection.close();
        };
    }, [channel, messageCallback]);
}
