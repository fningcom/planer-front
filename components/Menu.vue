<template>
    <div>
        <v-subheader>
            Профиль
        </v-subheader>
        <v-list v-if="personal_menus && personal_menus.length > 0">
            <v-list-item
                    v-for="(item, i) in personal_menus"
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

        <v-subheader v-if="menus && menus.length > 0">
            Меню
        </v-subheader>
        <v-list v-if="menus && menus.length > 0">
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
                personal_menus: [
                    {
                        icon: 'mdi mdi-checkbox-marked-circle-plus-outline',
                        title: 'Мои задачи',
                        to: '/personal/tasks'
                    },
                    {
                        icon: 'mdi mdi-file-document-check',
                        title: 'Мои документы',
                        to: '/personal/documents'
                    },
                ],
                // menus: [
                //     {
                //         icon: 'mdi mdi-file-sign',
                //         title: 'Журнал работ',
                //         to: '/tasks'
                //     },
                //     {
                //         icon: 'mdi mdi-account-group',
                //         title: 'Контакты',
                //         to: '/contacts'
                //     },
                //     {
                //         icon: 'mdi mdi-chart-line',
                //         title: 'Отчет',
                //         to: '/reports'
                //     }
                // ],
            }
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
