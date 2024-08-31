export type TCSize = 'small' | 'large';

const fontSize = {
    small: 3.5,
    default: 4,
    large: 4.5
} as const;

const padding = {
    btn: {
        small: { x: 2, y: 1 },
        default: { x: 3, y: 1.5 },
        large: { x: 4, y: 2 }
    },
    field: {
        small: { x: 2.5, y: 1.5 },
        default: { x: 3, y: 2 },
        large: { x: 4, y: 2 }
    }
} as const;

const sizes = Object.keys(fontSize);
const names = Object.keys(padding);

export const size_shortcuts = sizes
    .map(size =>
        names.map(name => ({
            [`${name}-${size}`]: `text-${fontSize[size]} px-${padding[name][size].x} py-${padding[name][size].y}`
        }))
    )
    .flat(2);
