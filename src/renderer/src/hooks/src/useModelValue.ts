import { computed, ComputedRef, ref, Ref, toRef, watch } from 'vue';

export interface ValueProps<T> {
    modelValue?: T;
    defaultValue?: T;
}

export interface ValueEmit<T> {
    (e: 'update:modelValue', value: T): void;
}

export interface UseModelValue<T> {
    mergedValue: ComputedRef<T>;
    updateValue: (value: T) => void;
}

export type ValueRequired<T> = T extends ValueProps<infer U> ? T & { defaultValue: U } : never;

export const useModelValue = <T>(
    props: ValueRequired<ValueProps<T>>,
    emits: ValueEmit<T>
): UseModelValue<T> => {
    const controlledValue = toRef(props, 'modelValue');
    const uncontrolledValue = ref<T>(props.defaultValue) as Ref<T>;

    watch(controlledValue, value => {
        if (value === undefined) return;
        uncontrolledValue.value = value;
    });

    const mergedValue: ComputedRef<T> = computed(() =>
        controlledValue.value === undefined ? uncontrolledValue.value : controlledValue.value
    );

    const updateValue = (value: T): void => {
        emits('update:modelValue', value);
        uncontrolledValue.value = value;
    };

    return { mergedValue, updateValue };
};
