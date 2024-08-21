<template>
    <div>
        <div v-if="tasks">
            <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="tasks"
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
                    <v-alert dense type="info" color="#4e4caf" style="margin-top: 5px;">
                        По вашему запросу найдено: {{ count }} задач
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
                <template v-slot:item.control="{ item }" >
                    <div style="display: flex;">
                        <v-icon v-if="item.quickly" color="error">mdi mdi-lightning-bolt-outline</v-icon>
                        <v-icon v-if="item.control" color="#37474f" dense>mdi mdi-account-clock-outline</v-icon>
                    </div>
                </template>
                <template v-slot:item.title="{ item }">
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
<!--                    <v-icon v-if="item.results_count > 0" color="#66bb6a" small>mdi mdi-check</v-icon>-->
<!--                    <v-icon v-if="item.results_count === 0 && item.status_id === 3" color="#ef5350" small>mdi mdi-help</v-icon>-->
                </template>
                <template v-slot:item.source="{ item }">
                    <b> {{ item.source.title }}</b>
                    <div class="smallRow" v-if="item.customer">{{ item.customer.title }}</div>
                </template>
                <template v-slot:item.formatted_created_at="{ item }">
                    <b> {{ item.formatted_created_at }}</b>
                    <div class="smallRow">{{ item.user.name }}</div>
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
                            style="font-size: 12px;margin: 4px 0;"
                            color="#78909C"
                            dark
                            label
                            outlined
                    >
                        <v-icon dark left small>mdi mdi-invoice-text-plus</v-icon>  В ожидании...
                    </v-chip>
                    <v-chip v-if="item && item.formatted_execution_date"
                            :class="{ 'text-red': isPastDeadline(item.formatted_execution_date) && item.status_id !== 3}"
                            style="font-size: 12px;margin: 4px 0;"
                            color="#66bb6a"
                            dark
                            label

                    >
                        <v-icon dark left small>mdi mdi-check-all</v-icon> {{ item.status.title }}
                    </v-chip>
                    <v-chip
                            v-else-if="item.started_work_date"
                            style="font-size: 12px;margin: 4px 0;"
                            color="#00838f"
                            dark
                            label
                            outlined
                    >
                        <b>В работе:&nbsp;</b> {{ timeAgo(item.started_work_date) }}
                    </v-chip>
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
                categories: [],
                loading: false,
                selected: [],
                activeMessage: null,
                singleSelect: true,
                msg: {},
                headers: [
                    {text: 'id', value: 'id', sortable: false, width: "40"},
                    {text: 'Создан', value: 'formatted_created_at', sortable: false},
                    {text: 'Статус', value: 'status', sortable: false, width: "150"},
                    {text: '', value: 'control', sortable: false, width: "40"},
                    {text: 'Заказчик', value: 'source', sortable: false},
                    {text: 'Задача', value: 'title', sortable: false},
                    {text: 'Объектов', value: 'contacts', sortable: false},
                    {text: 'Устройств', value: 'devices', sortable: false},
                    {text: 'Лиц', value: 'faces', sortable: false},
                    {text: 'Файлов', value: 'files', sortable: false},
                    {text: 'Срок исполнения', value: 'formatted_deadline_date', sortable: false, width: "150"},
                    {text: '', value: 'actions', sortable: false}
                ],
            }
        },
        computed: {
            ...mapState('tasks', ['filter_data', 'lastPage', 'currentPage', 'count', 'tasks', 'form_loading']),
            currentUserId() {
                return this.$auth.user.id;
            }
        },
        mounted() {
            this.getTasksList([], this.currentUserId, 1);
            this.$store.commit('tasks/STORE_CURRENT_PAGE', 1);
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
            async getTasksList(filter_data, user_id, page) {
                if (this.currentUserId) {
                    await this.$store.dispatch('tasks/GET_TASKS_FROM_API', [filter_data, this.currentUserId, page]);
                }
            },
            async handlePageChange(page) {
                this.getTasksList(this.filter_data, this.currentUserId, page)
            },
            async submitFilter(data) {
                this.$store.commit('tasks/STORE_CURRENT_PAGE', 1);
                this.$store.commit('tasks/STORE_FILTER_DATA', data);
                this.getTasksList(data, this.currentUserId, this.currentPage)
            },
            async resetFilter() {
                this.getTasksList([], 1);
                this.$store.commit('tasks/STORE_CURRENT_PAGE', 1);
                this.$store.commit('tasks/STORE_FILTER_DATA', []);
            },
            editDialog(id) {
                this.$store.commit('tasks/SET_DIALOG');
                this.$store.commit('tasks/SET_OPEN_TASK_ID', id);
                this.$store.dispatch('tasks/GET_TASK_FROM_API', id);
            }
        }
    }
</script>

<style scoped>
    .smallRow {
        font-size: 12px;
        font-family: monospace;
        font-style: italic;
    }

    .text-red {
        color: red;
        /*background-color: #d31414;*/
        padding: 5px;
        border: 1px solid red;
        border-radius: 5px;
    }
    .title-text {
        font-family: monospace;
    }
</style>
