export const useCursor = () => {
    const domSelection = document.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    if (!domRange) return { x: 0, y: 0 };
    const rect = domRange.getBoundingClientRect();
    // PERF cursor 改为响应式数据
    return { x: rect.left, y: rect.top };
};
