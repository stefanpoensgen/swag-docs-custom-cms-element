<?php declare(strict_types=1);

namespace Swag\CustomCmsElement\Core\Content\Cms\SalesChannel\Struct;

use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\Struct\Struct;

class ViewportMediaItemStruct extends Struct
{
    /**
     * @var MediaEntity|null
     */
    protected $media;

    /**
     * @var string|null
     */
    protected $viewport;

    public function getMedia(): ?MediaEntity
    {
        return $this->media;
    }

    public function setMedia(?MediaEntity $media): void
    {
        $this->media = $media;
    }

    public function getViewport(): ?string
    {
        return $this->viewport;
    }

    public function setViewport(?string $viewport): void
    {
        $this->viewport = $viewport;
    }
}
