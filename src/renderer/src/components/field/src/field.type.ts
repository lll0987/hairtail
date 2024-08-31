import { TCSize, TCStatus } from '@contracts/component';

export interface FieldProps {
    disabled?: boolean;
    size?: TCSize;
    label?: string;
    status?: TCStatus;
    feedback?: string;
}
