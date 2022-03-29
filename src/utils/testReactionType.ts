import { ReactionType } from '../types';

const matches: Record<keyof typeof ReactionType, RegExp[]> = {
    laugh: [
        /[Ll][Uu][Ll][Ww]?\b/,
        /\b[Ll][Oo]+[Ll]+\b/,
        /\b[Ll][Mm][Aa][Oo]+\b/,
        /\b[Kk][Ee][Kk][Ww]?\b/,
        /^草+$/,
        /ｗ+$/,
        /\bww+\b/,
        /\b[Aa]*([Hh]+[Aa]+)+[Hh]*\b/,
    ],
    cheer: [/[Pp][Oo]+[Gg]/, /\bpepeD\b/, /おおお+/],
    gasp: [/\b(D:)\s/, /[Mm]onka(S|W|GIGA)/, /えええ+/],
    boo: [/Copium/, /\b(D:)\s/, /Copege/],
    applause: [/\bClap\b/],
};

export function testReactionType(
    messageContent: string,
    type: ReactionType
): boolean {
    return matches[type].some((regx) => regx.test(messageContent));
}
