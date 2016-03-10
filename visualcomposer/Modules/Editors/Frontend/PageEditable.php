<?php
namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Helpers\WordPress\Nonce;
use VisualComposer\Framework\Container;

class PageEditable extends Container
{
    public function __construct()
    {
        add_action(
            'template_redirect',
            function () {
                if ($this->call('isPageEditable')) {
                    $this->call('buildPageEditable');
                }
            }
        );
    }

    private function isPageEditable(Request $request, Nonce $nonce)
    {
        return ($request->exists('vc-v-editable')
            && $request->exists('nonce')
            && $nonce->verifyAdmin($request->input('nonce')));
    }

    private function buildPageEditable(Url $url)
    {
        add_action(
            'the_post',
            function () use ($url) {
                remove_all_filters('the_content');
                add_filter(
                    'the_content',
                    function () use ($url) {
                        return '
<script>
        (function () {
            function vcvLoadJsCssFile( filename, filetype ) {
                var fileRef;
                filename = filename.replace( /\s/g, \'%20\' );

                if ( \'js\' === filetype ) {
                    fileRef = document.createElement( \'script\' );
                    fileRef.setAttribute( \'type\', \'text/javascript\' );
                    fileRef.setAttribute( \'src\', filename );
                } else if ( \'css\' === filetype ) {
                    fileRef = document.createElement( \'link\' );
                    if ( filename.substr( - 5, 5 ) === \'.less\' ) {
                        fileRef.setAttribute( \'rel\', \'stylesheet/less\' );
                    } else {
                        fileRef.setAttribute( \'rel\', \'stylesheet\' );
                    }

                    fileRef.setAttribute( \'type\', \'text/css\' );
                    fileRef.setAttribute( \'href\', filename );
                }
                if ( \'undefined\' !== typeof fileRef ) {
                    document.getElementsByTagName( \'head\' )[ 0 ].appendChild(
                        fileRef );
                }
            }

            vcvLoadJsCssFile( \'' . $url->to('public/dist/wp.bundle.css?' . uniqid()) . '\',
                \'css\' );
        })();
    </script>
	<div id="vc-v-editor">Loading...</div>';
                    }
                );
            },
            9999
        ); // after all the_post actions ended
    }
}
