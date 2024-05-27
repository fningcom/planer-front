<template>
    <div>
        <div v-if="documents">
            <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="documents"
                    item-key="id"
                    class="elevation-1 my-2"
                    :loading="loading"
                    loading-text="Загрузка данных... Пожалуйста ожидайте"
                    hide-default-footer
                    show-select
                    checkbox-color="primary"
                    :items-per-page=15
                    dense
            >
                <template v-slot:top>
                    <filters @submitFilter="submitFilter" @resetFilter="resetFilter"/>
                    <v-alert dense type="info" color="#546E7A" style="margin-top: 5px;">
                        По вашему запросу найдено: {{ count }} записей
                    </v-alert>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip :style="{backgroundColor:item.status.color }"
                            dark
                            label
                            class="mt-1 mb-1"
                            variant="outlined"
                    >
                        {{ item.status.title }}
                    </v-chip>
                </template>
                <template v-slot:item.source="{ item }">
                    <b> {{ item.source.title }}</b>
                    <div class="smallRow" v-if="item.executor">Исп: {{ item.executor }}</div>
                </template>
                <template v-slot:item.outgoing_number="{ item }">
                    <v-icon color="error" dense>mdi mdi-arrow-top-right</v-icon>
                    {{ item.outgoing_number }} от {{ item.formatted_outgoing_doc_date }} г.
                </template>
                <template v-slot:item.incoming_number="{ item }">
                    <v-icon color="#66BB6A" dense>mdi mdi-arrow-bottom-left</v-icon>
                    {{ item.incoming_number }} от {{ item.formatted_incoming_date }} г.
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon style="cursor:pointer" @click="editDialog(item.id)">mdi-pencil</v-icon>
                </template>
            </v-data-table>
            <v-pagination
                    v-model="currentPage"
                    :length="lastPage"
                    :total-visible="7"
                    @input="handlePageChange"
                    class="mt-4"
            ></v-pagination>
        </div>

    </div>
</template>

<script>
    import Filters from "./filters";

    export default {
        name: "DataTable",
        components: {Filters},
        props: ['filterData'],
        data() {
            return {
                snackbar: false,
                documents: [],
                categories: [],
                filter_data: [],
                loading: false,
                selected: [],
                activeMessage: null,
                singleSelect: true,
                count: 0,
                msg: {},
                headers: [
                    {text: 'id', value: 'id', sortable: false},
                    {text: 'Статус', value: 'status', sortable: false},
                    {text: 'Исходящий номер', value: 'outgoing_number', sortable: false},
                    {text: 'Входящий номер', value: 'incoming_number', sortable: false},
                    {text: 'Тип работы', value: 'type.title', sortable: false},
                    {text: 'Подразделение', value: 'source', sortable: false},
                    // {text: 'Исполнитель', value: 'user.name', sortable: false},
                    {text: 'Дата создания', value: 'formatted_created_at', sortable: false},
                    {text: 'Дата исполнения', value: 'formatted_execution_date', sortable: false},
                    {text: 'Срок исполнения', value: 'formatted_deadline_date', sortable: false},
                    {text: "", value: 'actions', sortable: false}
                ],
                lastPage: 0,
                currentPage: 0,
            }
        },
        computed: {
            currentUserId() {
                return this.$auth.user.id;
            }
        },
        mounted() {
            this.getDocumentsList([], 1);
            this.currentPage = 1;
        },
        methods: {
            async getDocumentsList(data, page) {
                console.log(data)
                let url = '';
                this.loading = true;
                this.filter_data = data;
                url = '/api/documents/' + this.currentUserId + '?page=' + page;
                const response = await this.$axios.$get(url, {
                    params: this.filter_data
                });
                this.documents = response.data;
                this.lastPage = response.last_page;
                this.currentPage = response.current_page;
                this.count = response.total;
                this.loading = false
            },
            async handlePageChange(value) {
                this.getDocumentsList(this.filter_data, value)
            },
            async submitFilter(data) {
                this.filter_data = data;
                this.currentPage = 1;
                this.getDocumentsList(this.filter_data, this.currentPage)
            },
            async resetFilter() {
                this.getDocumentsList([], 1);
                this.currentPage = 1;
            },
            editDialog(id){
                this.$store.commit('documents/SET_DIALOG');
                this.$store.commit('documents/SET_OPEN_DOC_ID', id);
                this.$store.dispatch('documents/GET_DOCUMENT_FROM_API', id);
            }
        }
    }
</script>

<style>
    .smallRow {
        font-size: 11px;
    }
</style>
