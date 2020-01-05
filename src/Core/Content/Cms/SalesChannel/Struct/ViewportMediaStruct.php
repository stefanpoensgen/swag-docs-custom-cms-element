<?php declare(strict_types=1);

namespace Swag\CustomCmsElement\Core\Content\Cms\SalesChannel\Struct;

use Shopware\Core\Framework\Struct\Struct;

class ViewportMediaStruct extends Struct
{
    /**
     * @var ViewportMediaItemStruct[]|null
     */
    protected $viewportMediaItems = [];

    /**
     * @return ViewportMediaItemStruct[]|null
     */
    public function getViewportMediaItems(): ?array
    {
        return $this->viewportMediaItems;
    }

    /**
     * @param ViewportMediaItemStruct[]|null $viewportMediaItems
     */
    public function setViewportMediaItems(?array $viewportMediaItems): void
    {
        $this->viewportMediaItems = $viewportMediaItems;
    }

    public function addViewportMediaItem(ViewportMediaItemStruct $viewportMediaItem): void
    {
        $this->viewportMediaItems[] = $viewportMediaItem;
    }
}
