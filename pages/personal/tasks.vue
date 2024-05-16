<template>
    <div>
        <h2>Мои задачи</h2>
        <filters />
        <data-table />
    </div>
</template>

<script>


    import Filters from "../../components/personal/tasks/filters";
    import DataTable from "../../components/personal/tasks/table";
    export default {
        name: 'MyTasks',
        head: {
            title: 'Мои задачи'
        },
        components: {DataTable, Filters},
        data() {
            return {

            }
        },
    }
</script>
