<template>
    <v-app dark>
        <v-navigation-drawer
                v-model="drawer"
                :mini-variant="miniVariant"
                :clipped="clipped"
                color="#37474F"
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
                        <v-list-item-title style="font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase;">
                            {{ $auth.user.name }}
                        </v-list-item-title>
                        <span @click="logout" class="light-blue--text pointer">Выход</span>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <v-divider></v-divider>
            <v-menu />
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
    import VMenu from "../components/vMenu";
    export default {
        name: 'DefaultLayout',
        components: {VMenu},
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
        mounted() {
           this.loadData()
        },
        methods: {
            async loadData(){
                // Справочник -> Статусы (Выпадающий список)
                this.statuses = await this.$axios.$get('/api/helpers/statuses');
                this.$store.commit('documents/SET_STATUSES',this.statuses);
                this.$store.commit('tasks/SET_STATUSES',this.statuses);
                // Список подразделений (Выпадающий список)
                this.groups = await this.$axios.$get('/api/helpers/groups');
                this.$store.commit('documents/SET_GROUPS', this.groups);
                // Список пользователей
                const users = await this.$axios.$get('/api/helpers/users');
                this.$store.commit('layout/SET_USERS', users);
                // Справочник -> Типы задач (Выпадающий список)
                this.task_types = await this.$axios.$get('/api/helpers/task_types');
                this.$store.commit('documents/SET_TYPES', this.task_types);
                this.task_subtypes = await this.$axios.$get('/api/helpers/task_subtypes');
                this.$store.commit('tasks/SET_SUBTYPES', this.task_subtypes);
                // Справочник -> Типы контактов (Выпадающий список)
                const contact_types = await this.$axios.$get('/api/helpers/contact-types');
                this.$store.commit('layout/SET_CONTACT_TYPES', contact_types);
                // Справочник -> Типы устройств (Выпадающий список при добавлении нового устройства)
                this.device_types = await this.$axios.$get('/api/helpers/device-types');
                this.$store.commit('layout/SET_DEVICE_TYPES', this.device_types);
            },

            async logout() {
                this.loading = true
                await this.$auth.logout();
                this.$router.push({
                    path: "/login",
                });
                this.loading = true
            },
        },

    }
</script>
<style>
    .v-application .light-blue--text {
        font-size: 15px;
    }

    .pointer {
        cursor: pointer;
    }
</style>
