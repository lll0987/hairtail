import { ValueEmit, ValueProps } from '@renderer/hooks';

export interface EditorEmits extends ValueEmit<string> {
    (e: 'enter'): void;
}
export interface EditorProps extends ValueProps<string> {}
