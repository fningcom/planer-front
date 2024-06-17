<template>
    <div>
        <v-card class="d-flex" flat tile>
            <h2 class="pa-2 mr-auto">Мои задачи </h2>
            <v-btn color="#4e4caf" @click="openDialog" dark small>
                <v-icon left>mdi mdi-plus</v-icon>задачу
            </v-btn>
        </v-card>
        <data-table/>
        <v-form :dialog="dialog" />
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import DataTable from "../../components/personal/tasks/table";
    import VForm from "../../components/personal/tasks/vForm";
    export default {
        name: 'MyTasks',
        head: {
            title: 'Мои задачи'
        },
        components: {VForm, DataTable},
        computed: {
            ...mapState('tasks', ['dialog']),
        },
        data() {
            return {
            }
        },
        methods: {
            openDialog(){
                this.$store.commit('tasks/SET_DIALOG');
            },
        }
    }
</script>
