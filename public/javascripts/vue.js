const Vue = require('vue/dist/vue.js')

window.onload = function () {
    Vue.component('kanban', require('./components/kanban.vue'))

    const app = new Vue({
        el: '#app'
    })
}