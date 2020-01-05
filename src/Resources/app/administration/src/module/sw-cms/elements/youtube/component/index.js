import { Component, Mixin } from 'src/core/shopware';
import template from './sw-cms-el-youtube.html.twig';
import './sw-cms-el-youtube.scss';

Component.register('sw-cms-el-youtube', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        videoSrc() {
            return `https://www.youtube.com/embed/${
                this.element.config.videoSrc.value
            }?controls=${
                this.element.config.showControls.value ? 1 : 0}`;
        },

        mediaUrl() {
            const context = Shopware.Context.api;
            const elemData = this.element.data.media;
            const mediaSource = this.element.config.media.source;

            if (mediaSource === 'mapped') {
                const demoMedia = this.getDemoValue(this.element.config.media.value);

                if (demoMedia && demoMedia.url) {
                    return demoMedia.url;
                }
            }

            if (elemData && elemData.id) {
                return this.element.data.media.url;
            }

            if (elemData && elemData.url) {
                return `${context.assetsPath}${elemData.url}`;
            }

            return `${context.assetsPath}/administration/static/img/cms/preview_mountain_large.jpg`;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('youtube');
            this.initElementData('youtube');
        }
    }
});
