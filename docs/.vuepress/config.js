module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    base: "/blog/",
    themeConfig: {
        sidebarDepth: 2,
        displayAllHeaders: true, // 默认值：false
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'External', link: 'https://google.com' },
        ],
        sidebar: {
            '/vue/': [
                '',
                'one',     /* /foo/ */
                'two',  /* /foo/one.html */
            ],
            '/webpack/': [
                '',
                'one'
            ],
        }
    }
}