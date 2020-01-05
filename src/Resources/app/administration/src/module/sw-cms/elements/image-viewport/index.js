import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'image-viewport',
    label: 'Image-Viewport',
    component: 'sw-cms-el-image-viewport',
    configComponent: 'sw-cms-el-config-image-viewport',
    previewComponent: 'sw-cms-el-preview-image-viewport',
    defaultConfig: {
        viewportMediaItems: {
            source: 'static',
            value: [],
            required: true,
            entity: {
                name: 'media'
            }
        }
    },
    enrich: function enrich(elem, data) {
        if (Object.keys(data).length < 1) {
            return;
        }

        Object.keys(elem.config).forEach((configKey) => {
            const entity = elem.config[configKey].entity;

            if (!entity) {
                return;
            }

            const entityKey = entity.name;
            if (!data[`entity-${entityKey}`]) {
                return;
            }

            elem.data[configKey] = [];
            elem.config[configKey].value.forEach((viewportMediaItem) => {
                elem.data[configKey].push({
                    viewport: viewportMediaItem.viewport,
                    deviceView: viewportMediaItem.deviceView,
                    media: data[`entity-${entityKey}`].get(viewportMediaItem.mediaId)
                });
            });
        });
    }

});
