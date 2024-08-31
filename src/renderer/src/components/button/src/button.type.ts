import type { TCStatus } from '@contracts/component';
import type { FieldProps } from '@renderer/components';

export interface ButtonProps extends Pick<FieldProps, 'disabled' | 'size'> {
    status?: TCStatus;
    loading?: boolean;
    color?: string;
}
