const getCursorPosition = () => {
    const domSelection = document.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    if (!domRange) return { top: 0, left: 0 };
    const rect = domRange.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
};

export const useTransform = () => {
    const { top, left } = getCursorPosition();
    const x = left + 4;
    const y = top;
    const transform = `translateX(${x}px) translateY(${y}px) `;

    return { transform };
};
