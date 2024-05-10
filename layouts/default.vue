<template>
    <v-app dark>
        <v-navigation-drawer
                v-model="drawer"
                :mini-variant="miniVariant"
                :clipped="clipped"
                color="indigo"
                dark
                fixed
                app
        >
            <!--            <template v-slot:prepend>-->
            <!--                <v-list-item two-line>-->
            <!--                    <v-list-item-avatar>-->
            <!--                        <img src="/img/avatar.jpg">-->
            <!--                    </v-list-item-avatar>-->

            <!--                    <v-list-item-content>-->
            <!--                        <v-list-item-title>Jane Smith</v-list-item-title>-->
            <!--                        <span @click="logout" class="light-blue&#45;&#45;text pointer">Выход</span>-->
            <!--                    </v-list-item-content>-->
            <!--                </v-list-item>-->
            <!--            </template>-->
            <v-divider></v-divider>
            <Menu/>
        </v-navigation-drawer>
        <v-app-bar
                :clipped-left="clipped"
                fixed
                app
                color="#fff"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>

            <v-toolbar-title>Планер</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container>
                <Nuxt/>
            </v-container>
        </v-main>


    </v-app>
</template>

<script>
    import Menu from "../components/menu";
    export default {
        name: 'DefaultLayout',
        components: {Menu},
        data() {
            return {
                clipped: false,
                drawer: true,
                fixed: false,
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Vuetify.js'
            }
        },
        methods: {},

        mounted() {
        }
    }
</script>
<style>
    .pointer {
        cursor: pointer;
    }
</style>
