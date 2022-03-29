export enum ReactionType {
    laugh = 'laugh',
    gasp = 'gasp',
    cheer = 'cheer',
    boo = 'boo',
    applause = 'applause',
}

export type Message = {
    content: string;
    id: string;
    reactions?: Partial<Record<keyof typeof ReactionType, boolean>>;
    time: number;
};
