import { Howl } from 'howler';

export const howlList = (files: string[]) => {
    const sounds: Howl[] = [];

    for (const file of files) {
        sounds.push(
            new Howl({
                src: `${process.env.PUBLIC_URL}/assets/${file}`,
                preload: false,
            })
        );
    }

    return () => {
        if (sounds.some((h) => h.playing())) {
            return;
        }

        // don't use the last (most recent) sound
        const index = Math.floor(
            Math.random() * Math.max(sounds.length - 1, 1)
        );

        const sound = sounds[index];

        // move sound to the back
        sounds.splice(index, 1);
        sounds.push(sound);

        switch (sound.state()) {
            case 'loading':
                return;
            case 'loaded':
                sound.play();
                return;
            case 'unloaded':
                sound.load();
                sound.once('load', function () {
                    sound.play();
                });
                return;
        }
    };
};
