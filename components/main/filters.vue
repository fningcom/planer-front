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
                    <v-select
                            v-model="task_type"
                            :items="task_types"
                            label="Тип задачи"
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
                        <div style="display: flex; margin-top: 10px;">
                            <v-checkbox
                                    v-model="quickly"
                                    label="Срочные"
                                    color="red"
                                    value="1"
                                    hide-details
                                    @change="submitFilter"
                                    class="mr-2"
                            ></v-checkbox>
                            <v-checkbox
                                    v-model="control"
                                    label="На контроле"
                                    color="indigo darken-3"
                                    value="1"
                                    @change="submitFilter"
                                    hide-details
                            ></v-checkbox>
                        </div>

                    </v-col>
                    <div class="d_type_block"
                    >
                        <v-radio-group
                                v-model="date_type"
                                column
                                dense
                                @change="submitFilter"
                        >
                            <v-radio
                                    label="Дата создания"
                                    value="2"
                            ></v-radio>
                            <v-radio
                                    label="Срок исполнения"
                                    value="3"
                            ></v-radio>
                            <v-radio
                                    label="Дата исполнения"
                                    value="1"
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
                    <v-col cols="2"
                           md="2">
                        <v-row>
                            <v-col>
                                <v-select
                                        v-if="isAdmin"
                                        v-model="user_id"
                                        :items="users"
                                        label="Исполнитель"
                                        outlined
                                        dense
                                        hide-details
                                        clearable
                                        @change="submitFilter"
                                        class="mb-1"
                                        item-value="id"
                                        item-text="name"
                                >
                                </v-select>
                                <v-select
                                        v-else
                                        v-model="user_id"
                                        :items="users"
                                        label="Исполнитель"
                                        outlined
                                        dense
                                        hide-details
                                        clearable
                                        class="mb-1"
                                        item-value="id"
                                        item-text="name"
                                        disabled
                                >
                                </v-select>

                            </v-col>
                        </v-row>

                        <div class="d-flex justify-start">
                            <v-btn color="cyan darken-3" dark @click="submitFilter" class="mr-2">
                                <v-icon dark left>mdi mdi-filter-check-outline</v-icon>
                                Фильтр
                            </v-btn>
                            <v-btn color="pink lighten-1" dark @click="resetForm">
                                <v-icon dark left>mdi mdi-close-thick</v-icon>
                                Сбросить
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

            </v-container>
        </v-form>
        <v-divider/>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "filters",
        data() {
            return {
                group: '',
                status: '',
                task_type: '',
                control: '',
                quickly: '',
                incoming_number: '',
                outgoing_number: '',
                finish_from: '',
                finish_to: '',
                date_type: '2',
                user_id: null
            }
        },
        mounted() {
            this.user_id = this.$auth.user.id
        },
        computed: {
            ...mapState('documents', ['groups', 'statuses', 'task_types']),
            ...mapState('layout', ['users']),
            isAdmin() {
                return this.$auth.user.isAdmin
            }
        },
        methods: {
            submitFilter() {
                this.$emit('submitFilter', {
                    group: this.group,
                    quickly: this.quickly,
                    control: this.control,
                    task_type: this.task_type,
                    incoming_number: this.incoming_number,
                    outgoing_number: this.outgoing_number,
                    finish_from: this.finish_from,
                    finish_to: this.finish_to,
                    status: this.status,
                    date_type: this.date_type,
                    user_id: this.user_id,
                })
            },
            resetForm(e) {
                this.group = "";
                this.task_type = "";
                this.quickly = "";
                this.control = "";
                this.incoming_number = "";
                this.outgoing_number = "";
                this.finish_from = "";
                this.finish_to = "";
                this.status = "";
                this.date_type = '2';
                this.user_id = null;
                this.$emit('resetFilter', {
                    group: "",
                    task_type: "",
                    quickly: "",
                    control: "",
                    incoming_number: "",
                    outgoing_number: "",
                    finish_from: "",
                    finish_to: "",
                    status: "",
                    date_type: "",
                    user_id: null
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
                this.submitFilter();
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
                this.submitFilter();
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
                this.submitFilter();
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
                this.submitFilter();
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
                this.submitFilter();
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
