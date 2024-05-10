<template>
    <div>
        <v-subheader>
            Меню
        </v-subheader>
        <v-list>
            <v-list-item
                    v-for="(item, i) in menus"
                    :key="i"
                    :to="item.to"
                    router
                    exact
            >
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </div>
</template>

<script>
    export default {
        name: "Menu",
        data(){
            return {
                menus: [
                    {
                        icon: 'mdi mdi-file-sign',
                        title: 'Журнал работ',
                        to: '/'
                    },
                    {
                        icon: 'mdi mdi-list-status',
                        title: 'Планы',
                        to: '/plans'
                    },
                    {
                        icon: 'mdi mdi-account-group',
                        title: 'Объекты',
                        to: '/objects'
                    },
                    {
                        icon: 'mdi mdi-file-document-multiple-outline',
                        title: 'Документы',
                        to: '/documents'
                    },
                    {
                        icon: 'mdi mdi-chart-line',
                        title: 'Отчеты',
                        to: '/reports'
                    }
                ],
            }
        },
        methods: {

        },
        computed: {

        },
    }
</script>

<style scoped>
    .li-child:nth-child(2n) {
        background: #394046;
    }

    .v-application .primary--text {
        color: #ffff !important;
    }

</style>
