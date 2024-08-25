import type { IRoute } from '@contracts/interface';

import { IconHomeFilled } from '@tabler/icons-vue';

import preview from '@renderer/views/preview';

export default [
    {
        key: 'preview',
        label: '组件预览',
        icon: IconHomeFilled,
        component: preview
    }
] as IRoute[];
