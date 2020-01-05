import template from './sw-cms-el-config-image-viewport.html.twig';
import './sw-cms-el-config-image-viewport.scss';

const { Component, Mixin } = Shopware;
const Criteria = Shopware.Data.Criteria;

Component.register('sw-cms-el-config-image-viewport', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    inject: ['repositoryFactory'],

    data() {
        return {
            initialFolderId: null,
            mediaItems: [],
            viewports: {
                xs: { view: 'mobile', res: '<576px' },
                sm: { view: 'mobile', res: '>576px' },
                md: { view: 'tablet-landscape', res: '>768px' },
                lg: { view: 'desktop', res: '>992px' },
                xl: { view: 'desktop', res: '>1200px' }
            }
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        uploadTag() {
            return `cms-element-viewport-image-media-item-config-${this.element.id}`;
        },

        viewportMediaItems() {
            if (this.element.data && this.element.data.viewportMediaItems && this.element.data.viewportMediaItems.length > 0) {
                return this.element.data.viewportMediaItems;
            }

            return [];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('image-viewport');

            if (this.element.config.viewportMediaItems.value.length > 0) {
                this.element.config.viewportMediaItems.value.forEach((item) => {
                    const criteria = new Criteria();
                    criteria.addFilter(
                        Criteria.equals('id', item.mediaId)
                    );

                    this.mediaRepository.search(criteria, Shopware.Context.api).then((response) => {
                        response[0].viewport = item.viewport;
                        response[0].deviceView = item.deviceView;
                        this.mediaItems.push(response[0]);
                    });
                });
            }
        },

        previewSource(viewport) {
            let mediaItem = this.mediaItems.find(
                (item) => item.viewport === viewport
            );

            if (mediaItem && mediaItem.id) {
                return mediaItem.id;
            }

            mediaItem = this.element.config.viewportMediaItems.value.find(
                (item) => item.viewport === viewport
            );

            if (mediaItem && mediaItem.mediaId) {
                return mediaItem.mediaId;
            }

            return null;
        },

        onImageUpload(media, viewport) {
            this.mediaRepository.get(media.targetId, Shopware.Context.api).then((mediaItem) => {
                this.element.config.viewportMediaItems.value.push({
                    mediaUrl: mediaItem.url,
                    mediaId: mediaItem.id,
                    viewport: viewport,
                    deviceView: this.viewports[viewport].view
                });

                mediaItem.deviceView = this.viewports[viewport].view;
                mediaItem.viewport = viewport;
                this.mediaItems.push(mediaItem);

                this.updateElementData();
                this.$emit('element-update', this.element);
            });
        },

        onSelectionChanges([mediaItem], viewport) {
            this.onImageRemove(viewport);

            this.element.config.viewportMediaItems.value.push({
                mediaUrl: mediaItem.url,
                mediaId: mediaItem.id,
                viewport: viewport,
                deviceView: this.viewports[viewport].view
            });

            this.$set(mediaItem, 'deviceView', this.viewports[viewport].view);
            this.$set(mediaItem, 'viewport', viewport);
            this.mediaItems.push(mediaItem);

            this.updateElementData();
            this.$emit('element-update', this.element);
        },

        onImageRemove(viewport) {
            this.element.config.viewportMediaItems.value =
                this.element.config.viewportMediaItems.value.filter(
                    (item) => item.viewport !== viewport
                );

            this.mediaItems = this.mediaItems.filter(
                (item) => item.viewport !== viewport
            );

            this.updateElementData();
            this.$emit('element-update', this.element);
        },

        updateElementData() {
            this.$set(this.element.data, 'viewportMediaItems', this.mediaItems);
        }
    }
});
