import template from './sw-cms-el-image-viewport.html.twig';
import './sw-cms-el-image-viewport.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-image-viewport', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {

        mediaUrl() {
            const context = Shopware.Context.api;
            const viewportMediaItems = this.element.data.viewportMediaItems || this.element.config.viewportMediaItems.value;
            let mediaItem;

            if (viewportMediaItems) {
                mediaItem = viewportMediaItems.find((item) => item.deviceView === this.currentDeviceView);

                if (!mediaItem) {
                    mediaItem = viewportMediaItems[viewportMediaItems.length - 1];
                }

                if (mediaItem && mediaItem.media && mediaItem.media.url) {
                    return `${mediaItem.media.url}`;
                }

                if (mediaItem && mediaItem.url) {
                    return `${mediaItem.url}`;
                }
            }

            return `${context.assetsPath}/administration/static/img/cms/preview_mountain_large.jpg`;
        },


        currentDeviceView() {
            return this.cmsPageState.currentCmsDeviceView;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('image-viewport');
            this.initElementData('image-viewport');
        }
    }
});
