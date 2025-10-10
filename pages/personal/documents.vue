<template>
    <div>
        <v-card class="d-flex" flat tile>
            <h2 class="pa-2 mr-auto">Мои документы </h2>
            <v-btn color="info" @click="openDialog" dark small>
                <v-icon left>mdi mdi-plus</v-icon>документ
            </v-btn>
        </v-card>
        <document-form :dialog="document_dialog" />
        <data-table/>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import DataTable from "../../components/personal/documents/table";
    import DocumentForm from "../../components/personal/documents/form";

    export default {
        name: "documents",
        components: {DocumentForm, DataTable},
        head: {
            title: 'Мои документы'
        },
        computed: {
            ...mapState('documents', ['document_dialog']),
        },
        data() {
            return {
            }
        },
        methods: {
            openDialog(){
                this.$store.commit('documents/SET_DIALOG');
            }
        }
    }
</script>

<style scoped>

</style>
