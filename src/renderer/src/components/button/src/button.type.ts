import type { TCStatus, TCSize } from '@contracts/component';

export interface ButtonProps {
    status?: TCStatus;
    size?: TCSize;
    loading?: boolean;
    color?: string;
}
