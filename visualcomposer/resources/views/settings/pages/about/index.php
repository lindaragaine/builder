<?php

if (!defined('ABSPATH')) {
    die('-1');
}

use VisualComposer\Helpers\Generic\Templates;

?>

<div class="wrap vc-page-welcome about-wrap">
    <h1>
        <?php
        echo sprintf(
            __('Welcome to Visual Composer %s', 'vc5'),
            preg_replace('/^(\d+)(\.\d+)?(\.\d)?/', '$1$2', VC_V_VERSION)
        );
        ?>
    </h1>

    <div class="about-text">
        <?php
        echo __(
            'Congratulations! You are about to use most powerful time saver for WordPress ever'
            . ' - page builder plugin with Frontend and Backend editors by WPBakery.',
            'vc5'
        );
        ?>
    </div>

    <div class="wp-badge vc-page-logo">
        <?php echo sprintf(__('Version %s', 'vc5'), VC_V_VERSION) ?>
    </div>

    <p class="vc-page-actions">

        <?php
        if ($hasAccessToSettings) : ?>
            <a href="<?php echo esc_attr(admin_url('admin.php?page=vc-general')) ?>" class="button button-primary">
                <?php echo __('Settings', 'vc5') ?>
            </a>
            <?php
        endif;
        ?>

        <a href="https://twitter.com/share"
            class="twitter-share-button"
            data-via="wpbakery"
            data-text="Take full control over your #WordPress site with Visual Composer page builder"
            data-url="https://vc.wpbakery.com"
            data-size="large">Tweet</a>
    </p>
    <?php
    vcapp('VisualComposer\Helpers\Generic\Templates')->render(
        'settings/pages/about/partials/tabs',
        [
            'activeSlug' => $activeSlug,
            'pageSlug' => $pageSlug,
            'tabs' => $tabs,
        ]
    );

    foreach ($tabs as $tab) :
        if ($tab['slug'] === $activeSlug) {
            vcapp('VisualComposer\Helpers\Generic\Templates')->render($tab['view']);
        }
    endforeach;
    ?>

</div>

<script>
    !function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + '://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, 'script', 'twitter-wjs');
</script>