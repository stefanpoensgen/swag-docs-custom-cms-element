<?php declare(strict_types=1);

namespace Swag\CustomCmsElement;

use Shopware\Core\Framework\Plugin;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;

class CustomCmsElement extends Plugin
{
    /**
     * @throws \Exception
     */
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);

        $loader = new XmlFileLoader($container, new FileLocator(__DIR__ . '/Core/Content/DependencyInjection'));
        $loader->load('media.xml');
    }
}
