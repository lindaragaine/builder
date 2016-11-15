<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceOrderTracking extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'woocommerce_order_tracking';

    private $shortcodeNs = 'woocommerce:';
}
