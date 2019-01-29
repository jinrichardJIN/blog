module.exports = {
    title: "Hello Richard",
    description: "Just playing around",
    base: "/blog/",
    themeConfig: {
        sidebar: {
            "/FE/": ["","Js","vue", "react","typescript","redux","next","nuxt"],
            "/guide/": ["", "1"],
            "/Personal/":["","koa","interview","排序算法","vue","nginx","linux"],

        },
        sidebarDepth: 2,
        displayAllHeaders: true, // 默认值：false
        nav: [
            { text: "简介", link: "/" },
            { text: "前端知识", link: "/FE/" },
            { text: "自我成长", link: "/Personal/" },
            { text: "Github", link: "https://github.com/jinrichardJIN" }
        ]
    }
};
