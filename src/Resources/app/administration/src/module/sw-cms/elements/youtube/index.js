import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'youtube',
    label: 'YouTube Video',
    component: 'sw-cms-el-youtube',
    configComponent: 'sw-cms-el-config-youtube',
    previewComponent: 'sw-cms-el-preview-youtube',
    defaultConfig: {
        media: {
            source: 'static',
            value: null,
            required: true,
            entity: {
                name: 'media'
            }
        },
        videoSrc: {
            source: 'static',
            value: 'Y4mGIZZL8jA'
        },
        showControls: {
            source: 'static',
            value: true
        }
    }
});
