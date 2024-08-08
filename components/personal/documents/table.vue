<template>
    <div>
        <div v-if="documents">
            <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="documents"
                    item-key="id"
                    class="elevation-1 my-2"
                    :loading="form_loading"
                    loading-text="Загрузка данных... Пожалуйста ожидайте"
                    hide-default-footer
                    show-select
                    checkbox-color="primary"
                    :items-per-page=15
                    dense
            >
                <template v-slot:top>
                    <filters @submitFilter="submitFilter" @resetFilter="resetFilter"/>
                    <v-alert dense type="info" style="margin-top: 5px;">
                        По вашему запросу найдено: {{ count }} документа
                    </v-alert>
                </template>
                <template v-slot:[`header.contacts`]="{ header }">
                    <v-icon dense>mdi mdi-at</v-icon>
                </template>
                <template v-slot:[`header.devices`]="{ header }">
                    <v-icon dense="">mdi mdi-devices</v-icon>
                </template>
                <template v-slot:[`header.faces`]="{ header }">
                    <v-icon dense>mdi mdi-account-tie</v-icon>
                </template>
                <template v-slot:[`header.files`]="{ header }">
<!--                    <v-icon>mdi mdi-paperclip-check</v-icon>-->
                    Резуьтат
                </template>
                <template v-slot:[`header.control`]="{ header }">
                    <v-icon dense>mdi mdi-account-star-outline</v-icon>
                </template>
                <template v-slot:item.id="{ item }">
                    {{ item.id }}
                </template>
                <template v-slot:item.control="{ item }">
                    <v-icon v-if="item.control" color="error">mdi mdi-lightning-bolt-outline</v-icon>
                </template>
                <template v-slot:item.contacts="{ item }">
                    {{ item.contacts.length }}
                </template>
                <template v-slot:item.devices="{ item }">
                    {{ item.devices.length  }}
                </template>
                <template v-slot:item.faces="{ item }">
                    {{ item.faces.length  }}
                </template>
                <template v-slot:item.files="{ item }">
                    <v-icon v-if="item.results_count > 0" color="#66bb6a" small>mdi mdi-paperclip-check</v-icon>
                    <v-icon v-if="item.result !== null && item.status_id === 3" color="#66bb6a" small>mdi mdi-note-edit-outline</v-icon>
                    <v-icon v-if="(item.results_count === 0 && item.result === null) && item.status_id === 3" color="#ef5350" small>mdi mdi-help</v-icon>
                </template>
                <template v-slot:item.source="{ item }">
                    <b> {{ item.source.title }}</b>
                    <div class="smallRow" v-if="item.executor">Исп: {{ item.executor }}</div>
                </template>
                <template v-slot:item.outgoing_number="{ item }">
                    <div>
                        <div class="float-start" style="margin: 8px 8px 0 0;">
                            <v-icon color="error" dense>mdi mdi-arrow-top-right</v-icon>
                        </div>
                        <div>№ {{ item.outgoing_number }}
                            <div class="smallRow">от {{ item.formatted_outgoing_doc_date }} г.</div>
                        </div>
                    </div>
                </template>
                <template v-slot:item.incoming_number="{ item }">
                    <div>
                        <div class="float-start" style="margin: 8px 8px 0 0;">
                            <v-icon color="#66BB6A" dense>mdi mdi-arrow-bottom-left</v-icon>
                        </div>
                        № {{ item.incoming_number }}
                        <div class="smallRow"> от {{ item.formatted_incoming_date }} г.</div>
                    </div>
                </template>
                <template v-slot:item.formatted_deadline_date="{ item }">
                      <span :class="{ 'text-red': isPastDeadline(item.formatted_deadline_date) && item.status_id !== 3}">
                          {{ item.formatted_deadline_date }}
                          <v-icon color="red"
                                  v-if="isPastDeadline(item.formatted_deadline_date) && item.status_id !== 3">
                              mdi mdi-flash-alert-outline
                          </v-icon>
                      </span>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip v-if="item && !item.formatted_execution_date && !item.started_work_date"
                            style="font-size: 12px;"
                            color="#78909C"
                            dark
                            label
                            outlined
                    >
                        <v-icon dark left small>mdi mdi-invoice-text-plus</v-icon>  В ожидании...
                    </v-chip>
                    <v-chip v-if="item && item.formatted_execution_date"
                            :class="{ 'text-red': isPastDeadline(item.formatted_execution_date) && item.status_id !== 3}"
                            style="font-size: 12px;"
                            color="#66bb6a"
                            dark
                            label

                    >
                        <v-icon dark left small>mdi mdi-check-all</v-icon> {{ item.status.title }}
                    </v-chip>
                    <v-chip
                            v-else-if="item.started_work_date"
                            style="font-size: 12px;"
                            color="#00838f"
                            dark
                            label
                            outlined
                    >
                        <b>В работе:&nbsp;</b> {{ timeAgo(item.started_work_date) }}
                    </v-chip>
                </template>
                <template v-slot:item.type.title="{ item }">
                    <div style="display: flex; align-items: center;">
                        <div style="margin-right: 5px;">
                            <img v-if="item.type.icon === null" src="/img/icons/task2.png" height="25" width="25"/>
                            <img v-else :src="item.type.icon" height="25" width="25"/>
                        </div>
                        <div>
                            <b>{{ item.type.title }} </b>
                            <div class="smallRow"><i class="title-text">{{ item.title }}</i></div>
                        </div>
                    </div>
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
    import {timeAgo} from '../../../plugins/helpers.js';
    import Filters from "./filters";
    import {mapState} from 'vuex';

    export default {
        name: "DataTable",
        components: {Filters},
        props: ['filterData'],
        data() {
            return {
                snackbar: false,
                // documents: [],
                categories: [],
                loading: false,
                selected: [],
                activeMessage: null,
                singleSelect: true,
                // count: 0,
                msg: {},
                headers: [
                    {text: 'id', value: 'id', sortable: false, width: "40"},
                    {text: 'Дата создания', value: 'formatted_created_at', sortable: false},
                    {text: 'Статус', value: 'status', sortable: false},
                    {text: '', value: 'control', sortable: false, width: "40"},
                    {text: 'Исходящий номер', value: 'outgoing_number', sortable: false, width: "150"},
                    {text: 'Входящий номер', value: 'incoming_number', sortable: false, width: "150"},
                    {text: 'Тип работы', value: 'type.title', sortable: false},
                    {text: 'Подразделение', value: 'source', sortable: false},
                    {text: 'Объектов', value: 'contacts', sortable: false},
                    {text: 'Устройств', value: 'devices', sortable: false},
                    {text: 'Лиц', value: 'faces', sortable: false},
                    {text: 'Файлов', value: 'files', sortable: false},
                    {text: 'Срок исполнения', value: 'formatted_deadline_date', sortable: false, width: "150"},
                    {text: '', value: 'actions', sortable: false}
                ],
                // lastPage: 0,
                // currentPage: 0,
            }
        },
        computed: {
            ...mapState('documents', ['filter_data', 'lastPage', 'currentPage', 'count', 'documents', 'form_loading']),
            currentUserId() {
                return this.$auth.user.id;
            }
        },
        mounted() {
            this.getDocumentsList([], this.currentUserId, 1);
            this.$store.commit('documents/STORE_CURRENT_PAGE', 1);
        },
        methods: {
            timeAgo(date) {
                return timeAgo(date)
            },
            isPastDeadline(dateString) {
                const [day, month, year] = dateString.split('.');
                const date = new Date(year, month - 1, day);
                date.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date <= today;
            },
            async getDocumentsList(filter_data, user_id, page) {
                if (this.currentUserId) {
                    await this.$store.dispatch('documents/GET_DOCUMENTS_FROM_API', [filter_data, this.currentUserId, page]);
                }
            },
            async handlePageChange(page) {
                this.getDocumentsList(this.filter_data, this.currentUserId, page)
            },
            async submitFilter(data) {
                this.$store.commit('documents/STORE_CURRENT_PAGE', 1);
                this.$store.commit('documents/STORE_FILTER_DATA', data);
                this.getDocumentsList(data, this.currentUserId, this.currentPage)
            },
            async resetFilter() {
                this.getDocumentsList([], 1);
                this.$store.commit('documents/STORE_CURRENT_PAGE', 1);
                this.$store.commit('documents/STORE_FILTER_DATA', []);
            },
            editDialog(id) {
                this.$store.commit('documents/SET_DIALOG');
                this.$store.commit('documents/SET_OPEN_DOC_ID', id);
                this.$store.dispatch('documents/GET_DOCUMENT_FROM_API', id);
            }
        }
    }
</script>

<style scoped>
    .smallRow {
        font-size: 11px;
    }

    .text-red {
        color: red;
        /*background-color: #d31414;*/
        padding: 5px;
        border: 1px solid red;
        border-radius: 5px;
    }
</style>
