<?php declare(strict_types=1);

namespace Swag\CustomCmsElement\Core\Content\Media\Cms\Type;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Cms\Exception\DuplicateCriteriaKeyException;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Exception\InconsistentCriteriaIdsException;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Swag\CustomCmsElement\Core\Content\Cms\SalesChannel\Struct\ViewportMediaItemStruct;
use Swag\CustomCmsElement\Core\Content\Cms\SalesChannel\Struct\ViewportMediaStruct;

class ImageViewportTypeDataResolver extends AbstractCmsElementResolver
{
    public const VIEWPORTS = ['xs', 'sm', 'md', 'lg', 'xl'];

    public function getType(): string
    {
        return 'image-viewport';
    }

    /**
     * @throws DuplicateCriteriaKeyException
     * @throws InconsistentCriteriaIdsException
     */
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $viewportMediaItemsConfig = $config->get('viewportMediaItems');

        if (!$viewportMediaItemsConfig || $viewportMediaItemsConfig->isMapped()) {
            return null;
        }

        $viewportMediaItems = $viewportMediaItemsConfig->getValue();

        $mediaIds = array_column($viewportMediaItems, 'id');

        $criteria = new Criteria($mediaIds);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $viewportMedia = new ViewportMediaStruct();
        $slot->setData($viewportMedia);

        if ($viewportMediaItems = $config->get('viewportMediaItems')) {
            $viewportMediaItems = $this->sortViewportMediaItems($viewportMediaItems->getValue());

            $tmpViewportMediaItem = $viewportMediaItems[0];
            foreach (self::VIEWPORTS as $viewport) {
                if (!in_array($viewport, array_column($viewportMediaItems, 'viewport'), true)) {
                    $viewportMediaItem = $tmpViewportMediaItem;
                    $viewportMediaItem['viewport'] = $viewport;
                    $viewportMediaItems[] = $viewportMediaItem;
                } else {
                    $key = array_search($viewport, array_column($viewportMediaItems, 'viewport'), true);
                    $tmpViewportMediaItem = $viewportMediaItems[$key];
                }
            }

            foreach ($this->sortViewportMediaItems($viewportMediaItems) as $viewportMediaItem) {
                $this->addMediaEntity($slot, $viewportMedia, $result, $viewportMediaItem);
            }
        }
    }

    private function addMediaEntity(
        CmsSlotEntity $slot,
        ViewportMediaStruct $viewportMedia,
        ElementDataCollection $result,
        array $config
    ): void {
        $viewportMediaItem = new ViewportMediaItemStruct();

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if (!$searchResult) {
            return;
        }

        /** @var MediaEntity|null $media */
        $media = $searchResult->get($config['mediaId']);
        if (!$media) {
            return;
        }

        $viewportMediaItem->setMedia($media);
        $viewportMediaItem->setViewport($config['viewport']);
        $viewportMedia->addViewportMediaItem($viewportMediaItem);
    }

    private function sortViewportMediaItems(array $viewportMediaItems): array
    {
        usort($viewportMediaItems, static function (array $a, array $b) {
            $keyA = array_search($a['viewport'], self::VIEWPORTS, true);
            $keyB = array_search($b['viewport'], self::VIEWPORTS, true);

            return $keyA <=> $keyB;
        });

        return $viewportMediaItems;
    }
}
