<template>
    <div>
        <v-card class="d-flex" flat tile>
            <h2 class="pa-2 mr-auto">Мои документы </h2>
            <v-btn color="#66BB6A" @click="openDialog" dark small>
                <v-icon left>mdi mdi-plus</v-icon>Новый документ
            </v-btn>
        </v-card>
        <data-table/>
        <v-form :dialog="dialog" />
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import DataTable from "../../components/personal/documents/table";
    import VForm from "../../components/personal/documents/vForm";

    export default {
        name: "documents",
        components: {VForm, DataTable},
        head: {
            title: 'Мои документы'
        },
        computed: {
            ...mapState('documents', ['dialog']),
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
