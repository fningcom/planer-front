<template>
    <div>
        <h2>Журнал работ</h2>
        <filters />
        <data-table/>
    </div>
</template>

<script>
    import Filters from "../components/tasks/filters";
    import DataTable from "../components/tasks/table";
    export default {
        name: "tasks",
        head: {
            title: 'Журнал работ'
        },
        components: {DataTable, Filters}
    }
</script>

<style scoped>

</style>
