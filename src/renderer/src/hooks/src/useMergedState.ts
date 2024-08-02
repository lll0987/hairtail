import { computed, ComputedRef, Ref, watch } from 'vue';

export const useMergedState = <T>(
    controlledStateRef: Ref<T | undefined>,
    uncontrolledStateRef: Ref<T>
): ComputedRef<T> => {
    watch(controlledStateRef, value => {
        if (value === undefined) return;
        uncontrolledStateRef.value = value;
    });
    return computed(() =>
        controlledStateRef.value === undefined ? uncontrolledStateRef.value : controlledStateRef.value
    );
};
