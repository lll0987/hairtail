import { TCStatus } from '@contracts/component';

export interface FieldProps {
    label?: string;
    disabled?: boolean;
    status?: TCStatus;
    feedback?: string;
}
