<template>
    <div>
        <h2>Мои документы</h2>
        <v-btn prepend-icon="mdi mdi-account-box-plus-outline" variant="outlined" @click="dialog=true">
            Добавить
        </v-btn>
        <data-table/>
        <v-form :dialog="dialog" />
    </div>
</template>

<script>
    import DataTable from "../../components/personal/documents/table";
    import VForm from "../../components/personal/documents/vForm";

    export default {
        name: "documents",
        components: {VForm, DataTable},
        head: {
            title: 'Мои документы'
        },
        data() {
            return {
                dialog: false
            }
        }
    }
</script>

<style scoped>

</style>
