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
                        <template v-slot:prepend>
                            <v-list-item two-line>
                                <v-list-item-avatar>
                                    <img src="/img/avatar.jpg">
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title style="font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase;">{{ $auth.user.name }}</v-list-item-title>
                                    <span @click="logout" class="light-blue--text pointer">Выход</span>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
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
            <v-app-bar-title>Планировщик</v-app-bar-title>
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
        methods: {
            async logout() {
                this.loading = true
                await this.$auth.logout();
                this.$router.push({
                    path: "/login",
                });
                this.loading = true
            },
        },

        mounted() {
        }
    }
</script>
<style>
    .v-application .light-blue--text {
        font-size: 15px;
        margin-left: 5px;
    }
    .pointer {
        cursor: pointer;
    }
</style>
