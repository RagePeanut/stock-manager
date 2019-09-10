module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/styles/_variables.sass"
                    @import "@/styles/_mixins.sass"
                `
            }
        }
    },

    pluginOptions: {
      quasar: {
        rtlSupport: true,
        treeShake: true
      }
    },

    transpileDependencies: [
      /[\\\/]node_modules[\\\/]quasar[\\\/]/
    ]
}
