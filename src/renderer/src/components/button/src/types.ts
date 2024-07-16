export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface ButtonProps {
    type?: ButtonType;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    color?: string;
}
