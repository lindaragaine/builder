<?php
/**
 * @var $editableLink - link to editable content
 */

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11"/>
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>"/>
    <title><?php __('Frontend editor', 'vc5'); /** @todo use more informative title */ ?></title>
    <link rel="stylesheet" property="stylesheet" type="text/css"
        href="<?php echo vcapp('VisualComposer\Helpers\Generic\Url')->to(
            'public/dist/wp.bundle.css?' . uniqid()
        ) ?>"/>
    <?php /** @todo add jquery into bundle.js */ ?>
</head>
<body>
<script>
    window.vcSourceID = <?php echo get_the_ID(); ?>;
    window.vcAjaxUrl = '<?php echo vcapp('VisualComposer\Helpers\Generic\Url')->ajax(); ?>';
    window.vcNonce = '<?php echo vcapp('VisualComposer\Helpers\Wordpress\Nonce')->admin(); ?>';
</script>
<script type="text/javascript" src="<?php echo vcapp('VisualComposer\Helpers\Generic\Url')->to(
    'public/dist/wp.bundle.js?' . uniqid()
); /* @todo: use assets folder */ ?>"></script>
<iframe src="<?php echo $editableLink; ?>" id="vc-v-editor-iframe"
    width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>
</body>
</html>
