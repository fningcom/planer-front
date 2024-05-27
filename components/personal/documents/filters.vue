<template>
    <div @keydown.esc="resetForm">
        <v-form>
            <v-container>
                <v-row
                        align="stretch"
                >

                    <v-col
                            cols="12"
                            md="2"
                    >
                        <v-select
                                v-model="status"
                                :items="statuses"
                                label="Статус"
                                outlined
                                dense
                                hide-details
                                clearable
                                @change="submitFilter"
                                class="mb-1"
                        >
                            <template v-slot:item="{ item }">
                                {{ item.title }}
                            </template>
                            <template v-slot:selection="{ item, index }">
                                {{ item.title }}
                            </template>
                        </v-select>
                        <v-select
                                v-model="group"
                                :items="groups"
                                label="Подразделение"
                                outlined
                                dense
                                @change="submitFilter"
                                hide-details
                                clearable
                        >
                            <template v-slot:item="{ item }">
                                {{ item.title }}
                            </template>
                            <template v-slot:selection="{ item, index }">
                                {{ item.title }}
                            </template>
                        </v-select>
                    </v-col>
                    <v-col
                            cols="12"
                            md="2"
                    >
                        <v-text-field
                                v-model="outgoing_number"
                                append-icon="mdi mdi-arrow-top-right"
                                label="Исходящий номер"
                                v-on:keyup.enter="submitFilter"
                                outlined
                                dense
                                hide-details
                                class="mb-1"
                                color="error"
                        ></v-text-field>
                        <v-text-field
                                v-model="incoming_number"
                                append-icon="mdi mdi-arrow-bottom-left"
                                label="Входящий номер"
                                v-on:keyup.enter="submitFilter"
                                outlined
                                dense
                                hide-details
                                color="#66BB6A"
                        ></v-text-field>
                    </v-col>
                    <div class="d_type_block"
                    >
                    <v-radio-group
                            v-model="date_type"
                            column
                            dense
                    >
                        <v-radio
                                label="Дата создания"
                                value="2"
                        ></v-radio>
                        <v-radio
                                label="Дата исполнения"
                                value="1"
                        ></v-radio>
                        <v-radio
                                label="Срок исполнения"
                                value="3"
                        ></v-radio>
                    </v-radio-group>
                    </div>
                    <v-col
                            cols="12"
                            md="2"
                    >
                        <v-text-field
                                type="date"
                                v-model="finish_from"
                                label="с"
                                v-on:keyup.enter="submitFilter"
                                outlined
                                dense
                                hide-details
                                class="mb-1"
                        ></v-text-field>
                        <v-text-field
                                type="date"
                                v-model="finish_to"
                                label="по"
                                v-on:keyup.enter="submitFilter"
                                outlined
                                dense
                                hide-details
                        ></v-text-field>

                    </v-col>
                    <div class="tab_day"
                    >
                        <v-chip color="primary" outlined @click="toDay">
                            Сегодня
                        </v-chip>
                        <v-chip color="primary" outlined @click="yesterday">
                            Вчера
                        </v-chip>
                        <v-chip color="primary" outlined @click="this_week">
                            На этой неделе
                        </v-chip>
                        <v-chip color="primary" class="mt-2" tonal @click="this_month">
                            В этом месяце
                        </v-chip>
                        <v-chip color="primary" class="mt-2" tonal @click="last_month">
                            За прошлый месяц
                        </v-chip>
                    </div>
                    <v-col
                            cols="12"
                            md="2"
                    >

                        <div>
                            <v-btn color="green lighten-1" dark  @click="submitFilter">Фильтр</v-btn>
                        </div>
                        <div class="mt-1">
                            <v-btn color="red lighten-1" dark  @click="resetForm">Сбросить</v-btn>
                        </div>
                    </v-col>
                </v-row>

            </v-container>
        </v-form>
        <v-divider/>
    </div>
</template>

<script>
    export default {
        name: "filters",
        data() {
            return {
                groups: [
                    {title: 'Загрузка данных...'}
                ],
                statuses: [
                    {title: 'Загрузка данных...'}
                ],
                group: '',
                status: '',
                incoming_number: '',
                outgoing_number: '',
                finish_from: '',
                finish_to: '',
                date_type: 1
            }
        },
        mounted() {
            this.getStatuses();
            this.getGroups();
        },

        methods: {
            async getGroups() {
                this.groups = await this.$axios.$get('/api/helpers/groups');
                this.task_types = await this.$axios.$get('/api/helpers/task_types');
                this.$store.commit('documents/SET_GROUPS', this.groups);
                this.$store.commit('documents/SET_TYPES', this.task_types);
            },
            async getStatuses() {
                this.statuses = await this.$axios.$get('/api/helpers/statuses');
                this.$store.commit('documents/SET_STATUSES',this.statuses);
            },
            submitFilter() {
                this.$emit('submitFilter', {
                    group: this.group,
                    incoming_number: this.incoming_number,
                    outgoing_number: this.outgoing_number,
                    finish_from: this.finish_from,
                    finish_to: this.finish_to,
                    status: this.status,
                    date_type: this.date_type,
                })
            },
            resetForm(e) {
                this.group = "";
                this.incoming_number = "";
                this.outgoing_number = "";
                this.finish_from = "";
                this.finish_to = "";
                this.status = "";
                this.date_type = 1;
                this.$emit('resetFilter', {
                    group: "",
                    incoming_number: "",
                    outgoing_number: "",
                    finish_from: "",
                    finish_to: "",
                    status: "",
                    date_type: "",
                })
            },
            toDay() {
                const today = new Date();
                const year = today.getFullYear();
                let month = today.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month; // добавляем ноль, если месяц < 10
                }
                let day = today.getDate();
                if (day < 10) {
                    day = '0' + day; // добавляем ноль, если день < 10
                }
                this.finish_from = `${year}-${month}-${day}`;
                this.finish_to = `${year}-${month}-${day}`;
            },
            yesterday() {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1); // получаем дату вчерашнего дня
                const year = yesterday.getFullYear();
                let month = yesterday.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month; // добавляем ноль, если месяц < 10
                }
                let day = yesterday.getDate();
                if (day < 10) {
                    day = '0' + day; // добавляем ноль, если день < 10
                }
                this.finish_from = `${year}-${month}-${day}`;
                this.finish_to = `${year}-${month}-${day}`;
            },
            this_week() {
                const today = new Date();
                const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

                const format = date => {
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    if (month < 10) month = '0' + month;
                    if (day < 10) day = '0' + day;
                    return `${year}-${month}-${day}`;
                };

                this.finish_from = format(firstDayOfWeek);
                this.finish_to = format(lastDayOfWeek);
            },
            this_month() {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                const format = date => {
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    if (month < 10) month = '0' + month;
                    if (day < 10) day = '0' + day;
                    return `${year}-${month}-${day}`;
                };

                this.finish_from = format(firstDayOfMonth);
                this.finish_to = format(lastDayOfMonth);
            },
            last_month() {
                const today = new Date();
                const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);

                const format = date => {
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    if (month < 10) month = '0' + month;
                    if (day < 10) day = '0' + day;
                    return `${year}-${month}-${day}`;
                };

                this.finish_from = format(firstDayOfPrevMonth);
                this.finish_to = format(lastDayOfPrevMonth);
            }
        },
    }
</script>

<style>
    .tab_day {
        width: 285px;
        margin-top: 15px;
    }
    .v-input--selection-controls {
        margin: 5px 0 0 0;
        padding: 0;
    }
    .v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
        margin-bottom: 3px;
    }
    .d_type_block {
        margin-top: 10px;
        margin-left: 20px;
        margin-bottom: -2px;
    }
</style>
