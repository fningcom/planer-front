<template>
    <div>

        <v-card class="d-flex" flat tile>
            <h2 class="pa-2 mr-auto">Мои задачи </h2>
            <v-btn color="#4e4caf" @click="openDialog" dark small>
                <v-icon left>mdi mdi-plus</v-icon>задачу
            </v-btn>
        </v-card>
        <task-form :dialog="dialog" />
        <data-table/>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import DataTable from "../../components/personal/tasks/table";
    import TaskForm from "../../components/personal/tasks/form";
    export default {
        name: 'MyTasks',
        head: {
            title: 'Мои задачи'
        },
        components: {TaskForm, DataTable},
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
