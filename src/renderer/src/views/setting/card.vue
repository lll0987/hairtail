<template>
    <div grid="~ rows-[auto_auto_1fr]" class="bdr rounded">
        <div class="bdr-b bg-white p-2">
            <span class="decorative"><slot name="title"></slot></span>
        </div>
        <div class="bdr-dashed border-b-2 p-2">
            <slot name="form"></slot>
        </div>
        <div class="m-2 overflow-y-auto scrollbar-small">
            <slot></slot>
        </div>
    </div>
</template>
