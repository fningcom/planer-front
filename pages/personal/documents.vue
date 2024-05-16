<template>
    <div>
        <h2>Мои документы</h2>
        <data-table/>
    </div>
</template>

<script>
    import DataTable from "../../components/personal/documents/table";

    export default {
        name: "documents",
        components: {DataTable},
        head: {
            title: 'Мои документы'
        },
    }
</script>

<style scoped>

</style>
