<?php declare(strict_types=1);

namespace Swag\CustomCmsElement\Core\Content\Media\Cms\Type;

use Shopware\Core\Content\Media\Cms\ImageCmsElementResolver;

class YoutubeTypeDataResolver extends ImageCmsElementResolver
{
    public function getType(): string
    {
        return 'youtube';
    }
}
