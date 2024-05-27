<template>
    <div>
        <v-card class="d-flex" flat tile>
            <h2 class="pa-2 mr-auto">Мои документы </h2>
            <v-btn color="info" @click="openDialog" dark small>
                <v-icon left>mdi mdi-plus</v-icon>документ
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
    import VContactForm from "../../components/personal/contacts/vContactForm";

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
