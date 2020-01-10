let CTYPE = (() => {

    return {
        page_limit: 20,

        namespace: {
            default: 'file',
            img: 'img',
            video: 'video'
        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_h: 0.5625,
            identity: 0.63
        },
    }

})();

export default CTYPE;