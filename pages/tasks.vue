<template>
    <div>
        <h2>Журнал работ</h2>
        <data-table/>
        <all-task-form :dialog="dialog"/>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Filters from "../components/tasks/filters";
    import DataTable from "../components/tasks/table";
    import AllTaskForm from "../components/tasks/form";
    export default {
        name: "tasks",
        head: {
            title: 'Журнал работ'
        },
        components: {AllTaskForm, DataTable, Filters},
        computed: {
            ...mapState('tasks', ['dialog']),
        },
        methods: {
            openDialog(){
                this.$store.commit('tasks/SET_DIALOG');
            },
        }
    }
</script>

<style scoped>

</style>
