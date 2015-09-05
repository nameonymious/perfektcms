/* jshint node:true */
var fs = require('fs');

var site = require('apostrophe-site')();

site.init({

    // This line is required and allows apostrophe-site to use require() and manage our NPM modules for us.
    root: module,
    shortName: 'apostrophe-sandbox',
    hostName: 'apostrophe-sandbox.com',
    title: 'Apostrophe Sandbox',
    sessionSecret: 'apostrophe sandbox demo party',
    adminPassword: 'demo',

    mailer: {
        transport: 'sendmail',
        transportOptions: {}
    },


    // Force a2 to prefix all of its URLs. It still
    // listens on its own port, but you can configure
    // your reverse proxy to send it traffic only
    // for URLs with this prefix. With this option
    // "/" becomes a 404, which is supposed to happen!

    // prefix: '/test',

    // If true, new tags can only be added by admins accessing
    // the tag editor modal via the admin bar. Sometimes useful
    // if your folksonomy has gotten completely out of hand
    lockTags: false,

    // Give users a chance to log in if they attempt to visit a page
    // which requires login
    secondChanceLogin: true,

    locals: require('./lib/locals.js'),

    // you can define lockups for areas here
    // lockups: {},

    // Here we define what page templates we have and what they will be called in the Page Types menu.

    // For html templates, the 'name' property refers to the filename in ./views/pages, e.g. 'default'
    // refers to '/views/pages/default.html'.

    // The name property can also refer to a module, in the case of 'blog', 'map', 'events', etc.

    pages: {
        types: [
            {name: 'default', label: 'Default Page'},
            {name: 'home', label: 'Home Page'},
            {name: 'blog', label: 'Blog'},
            {name: 'snippets', label: 'Snippets'}
        ]
    },

    /*i18n: {
     // setup some locales - other locales default to defaultLocale silently
     locales:['ru', 'de'],

     // you may alter a site wide default locale (optional, defaults to 'en')
     defaultLocale: 'ru',

     // sets a custom cookie name to parse locale settings from  - defaults to apos_language (optional)
     cookie: 'apos_language'

     // whether to write new locale information to disk automatically - defaults to true (you will want to shut it off in production)
     ,updateFiles: false
     },*/

    i18n: {
        // setup some locales - other locales default to defaultLocale silently
        locales: ['ru', 'de'],

        // you may alter a site wide default locale (optional, defaults to 'en')
        //defaultLocale: 'ru',

        // sets a custom cookie name to parse locale settings from  - defaults to apos_language (optional)
        cookie: 'yourcookiename',

        // whether to write new locale information to disk automatically - defaults to true (you will want to shut it off in production)
        // updateFiles: false
    },

    lockups: {
        left: {
            label: 'Left',
            tooltip: 'Inset Left',
            icon: 'icon-arrow-left',
            widgets: ['slideshow', 'video'],
            slideshow: {
                size: 'one-half'
            }
        },
        right: {
            label: 'Right',
            tooltip: 'Inset Right',
            icon: 'icon-arrow-right',
            widgets: ['slideshow', 'video'],
            slideshow: {
                size: 'one-half'
            }
        }
    },

    // These are the modules we want to bring into the project.
    modules: {
        // Styles required by the new editor, must go FIRST

        'apostrophe-editor-2': {},
        'apostrophe-ui-2': {},


        'apostrophe-blog-2': {
            perPage: 5,
            pieces: {
                addFields: [
                    {
                        name: '_author',
                        type: 'joinByOne',
                        withType: 'person',
                        idField: 'authorId',
                        label: 'Author'
                    }
                ]
            }
        },
        'apostrophe-people': {
            addFields: [
                {
                    name: '_blogPosts',
                    type: 'joinByOneReverse',
                    withType: 'blogPost',
                    idField: 'authorId',
                    label: 'Author',
                    withJoins: ['_editor']
                },
                {
                    name: 'thumbnail',
                    type: 'singleton',
                    widgetType: 'slideshow',
                    label: 'Picture',
                    options: {
                        aspectRatio: [100, 100]
                    }
                }
            ]
        },
        'apostrophe-forms': {},
        'apostrophe-groups': {},
        'apostrophe-browserify': {
            files: ["./public/js/modules/_site.js"]
        },

        'apostrophe-schema-widgets': {
            widgets: [
                {
                    name: 'hero',
                    label: 'Hero',
                    extend: 'apostrophe-snippets',
                    schema: [
                        {
                            name: 'headline',
                            label: 'headline',
                            type: 'string',
                            // required: true
                        },
                        {
                            name: 'tagline',
                            label: 'tagline',
                            type: 'string',
                            //required: true
                        },
                        {
                            name: 'image',
                            label: 'image',
                            type: 'singleton',
                            //required: true,
                            widgetType: 'slideshow',
                            options: {
                                limit: 1
                            }
                        }
                    ]
                },
                {
                    name: 'banner',
                    label: 'banner',
                    extend: 'apostrophe-snippets',
                    schema: [
                        {
                            name: 'headline',
                            label: 'headline',
                            type: 'string',
                            // required: true
                        },
                        {
                            name: 'tagline',
                            label: 'tagline',
                            type: 'string',
                            //required: true
                        },
                        {
                            name: 'image',
                            label: 'image',
                            type: 'singleton',
                            //required: true,
                            widgetType: 'slideshow',
                            options: {
                                limit: 1
                            }
                        }
                    ]
                }
                ,
                {
                    name: 'kkk',
                    label: 'k',
                    extend: 'apostrophe-snippets',
                    schema: [
                        {
                            name: 'headline',
                            label: 'headline',
                            type: 'string',
                            // required: true
                        },
                        {
                            name: 'tagline',
                            label: 'tagline',
                            type: 'string',
                            //required: true
                        },
                        {
                            name: 'image',
                            label: 'image',
                            type: 'singleton',
                            //required: true,
                            widgetType: 'slideshow',
                            options: {
                                limit: 1
                            }
                        }
                    ]
                },

                {
                    name: 'box',
                    label: 'Box',
                    instructions: 'Click "add" to add your first link. Enter a label and paste a URL for each link.',
                    schema: [
                        {
                            name: 'box',
                            type: 'area',
                            label: 'content',
                            options: {

                                styles: [
                                    {value: 'p', label: 'P'},
                                    {value: 'h2', label: 'H2', attributes: {class: 'normal-heading'}},
                                    {value: 'h3', label: 'Blue Heading', attributes: {class: 'blue-text'}}
                                ]

                            }
                        }
                    ]
                }
            ]
        },
        'apostrophe-snippets': {},
        'stories': {
            extend: 'apostrophe-snippets',
            name: 'stories',
            label: 'Stories',
            instance: 'story',
            instanceLabel: 'Story',
            addFields: [
                {
                    name: 'year',
                    type: 'integer',
                    label: 'Year',
                    def: '2013'
                },
                {
                    name: 'publisher',
                    type: 'string',
                    label: 'Publisher',
                }
            ]
        },
        'apostrophe-blocks': {
            types: [
                {
                    name: 'box',
                    label: 'Box'
                }
                ,
                {
                    name: 'one',
                    label: 'One Column e'
                },
                {
                    name: 'two',
                    label: 'Two Column'
                }
                ,
                {
                    name: 'three',
                    label: 'three Column'
                }


            ]
        },
        'apostrophe-localization': {
            defaultLocale: 'ru',
            locales: {'ru': 'Russski', 'de': 'Deutsch'},
            neverTypes: ['banner', 'hero', 'home', 'slideShow', 'default', 'image', 'thumbnail']
        }
    },

    sanitizeHtml: {


        allowedAttributes: {
            a: ['href', 'name', 'target'],
            img: ['src'],
            div: ['class'],
            h2: ['class']

        },
        allowedClasses: {
            'h2': ['normal-heading']
        }
    },

    // These are assets we want to push to the browser.
    // The scripts array contains the names of JS files in /public/js,
    // while stylesheets contains the names of LESS files in /public/css
    assets: {
        stylesheets: ['site'],
        scripts: ['_site-compiled']
    },

    afterInit: function (callback) {
        // We're going to do a special console message now that the
        // server has started. Are we in development or production?
        var locals = require('./data/local');
        if (locals.development || !locals.minify) {
            console.error('Apostrophe Sandbox is running in development.');
        } else {
            console.error('Apostrophe Sandbox is running in production.');
        }

        callback(null);
    }

});
