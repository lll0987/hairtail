export type ButtonType = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';

export interface ButtonProps {
    type?: ButtonType;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    color?: string;
}
