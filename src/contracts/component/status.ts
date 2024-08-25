import type { TColor, TShade } from '.';

export type TCStatus = 'error' | 'success' | 'warning' | 'primary' | 'accent';

const colorMap: Record<TCStatus, TColor> = {
    error: 'green',
    success: 'amber',
    warning: 'rose',
    primary: 'lime',
    accent: 'sky'
};
export const status_colors: string[] = Object.keys(colorMap).map(key => colorMap[key]);

export const getStatusColor = (status: TCStatus, shade: TShade = '500') => `${colorMap[status]}-${shade}`;
