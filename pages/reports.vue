<template>
    <div>
        <h2>Отчет</h2>
        <v-form>
            <v-container>
                <v-row
                        align="stretch"
                >

                    <v-col>
                        <div style="display: flex; width: 100%;">
                            <v-text-field
                                    type="date"
                                    v-model="from"
                                    label="с"
                                    v-on:keyup.enter="submitFilter"
                                    outlined
                                    dense
                                    hide-details
                                    class="mb-1 mr-2 col-2"

                            ></v-text-field>
                            <v-text-field
                                    type="date"
                                    v-model="to"
                                    label="по"
                                    v-on:keyup.enter="submitFilter"
                                    outlined
                                    dense
                                    hide-details
                                    class="mb-1 mr-2 col-2"
                            ></v-text-field>
                            <!--                            <v-select-->
                            <!--                                    v-model="user_id"-->
                            <!--                                    :items="users"-->
                            <!--                                    label="Исполнитель"-->
                            <!--                                    outlined-->
                            <!--                                    dense-->
                            <!--                                    hide-details-->
                            <!--                                    class="mb-1 col-2 mr-2"-->
                            <!--                                    item-value="id"-->
                            <!--                                    item-text="name"-->
                            <!--                            >-->
                            <!--                            </v-select>-->
                            <v-btn color="green darken-1" dark @click="generate" class="mr-2">
                                Сформировать
                            </v-btn>
                        </div>

                    </v-col>
                </v-row>
                <v-row>
                    <div style="width: 950px;padding: 12px;">
                        <v-tabs v-model="tab">
                            <v-tab href="#tab-1">
                                Общий отчет
                            </v-tab>
                            <v-tab href="#tab-2">
                                Детальный отчет
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="tab" style="min-height: 595px; font-family: 'Material Design Icons';">
                            <v-tab-item value="tab-1" >
                                <div class="spinner" v-if="all_spinner">
                                    <v-container style="height: 400px;">
                                        <v-row
                                                class="fill-height"
                                                align-content="center"
                                                justify="center"
                                        >
                                            <v-col
                                                    class="text-subtitle-1 text-center"
                                                    cols="12"
                                            >
                                                Идет формирование отчета...
                                            </v-col>
                                            <v-col cols="6">
                                                <v-progress-linear
                                                        color="light-blue darken-3"
                                                        indeterminate
                                                        rounded
                                                        height="6"
                                                ></v-progress-linear>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </div>
                                <div v-if="allData && allData.length > 0">
                                    <div style="text-align: center; padding-top: 25px; padding-bottom: 25px">
                                        <h1>Отчет</h1>
                                        <h2>о деятельности подразделения</h2>
                                        <h3>за период с {{ formatDateBase(from) }} по {{ formatDateBase(to) }} гг. </h3>
<!--                                        <div class="table-header">Сводная таблица</div>-->
                                    </div>
                                    <div class="block-list">
                                        <v-simple-table dense>
                                            <template v-slot:default>
                                                <thead>
                                                <tr>
                                                    <th class="text-left">
                                                        Проводимое мероприятие
                                                    </th>
                                                    <th class="text-center" style="font-weight: bold;background-color: #d5d5d58a;">
                                                        Количество<br>
                                                        объектов
                                                    </th>
                                                    <th class="text-left">
                                                       Срочные
                                                    </th>
                                                    <th class="text-center">
                                                        На контроле <br> руководства
                                                    </th>
                                                    <th class="text-center">
                                                        Деанонимизировано
                                                    </th>
                                                    <th class="text-left">
                                                       Маркин
                                                    </th><th class="text-left">
                                                       Денисов
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr
                                                        v-for="item in allData"
                                                        :key="item.id"
                                                >
                                                    <td>{{ item.title }}</td>
                                                    <td style="text-align: center; font-weight: bold;background-color: #d5d5d58a;">  {{ item.total_sum > 0 ? item.total_sum : '-' }}</td>
                                                    <td style="text-align: center;">  {{ item.total_quickly > 0 ? item.total_quickly : '-' }}</td>
                                                    <td style="text-align: center;">  {{ item.total_control > 0 ? item.total_control : '-' }}</td>
                                                    <td style="text-align: center;">  {{ item.total_deanon_success_count > 0 ? item.total_deanon_success_count : '-' }}</td>
                                                    <td style="text-align: center;"> {{ item.employees[1]['sum'] > 0 ? item.employees[1]['sum'] : '-' }} </td>
                                                    <td style="text-align: center;"> {{ item.employees[2]['sum'] > 0 ? item.employees[2]['sum'] : '-' }} </td>
                                                </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </div>
<!--                                    <div class="table-header">Детальный отчет</div>-->
                                </div>
                            </v-tab-item>
                            <v-tab-item value="tab-2">
                                <div class="spinner" v-if="min_spinner">
                                    <v-container style="height: 400px;">
                                        <v-row
                                                class="fill-height"
                                                align-content="center"
                                                justify="center"
                                        >
                                            <v-col
                                                    class="text-subtitle-1 text-center"
                                                    cols="12"
                                            >
                                                Идет формирование отчета...
                                            </v-col>
                                            <v-col cols="6">
                                                <v-progress-linear
                                                        color="light-blue darken-3"
                                                        indeterminate
                                                        rounded
                                                        height="6"
                                                ></v-progress-linear>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </div>
                            </v-tab-item>
                        </v-tabs-items>


                    </div>

                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {formatDate} from '../plugins/helpers.js'

    export default {
        name: "reports",
        head: {
            title: 'Отчет'
        },
        data() {
            return {
                tab: null,
                all_spinner: false,
                min_spinner: false,
                kdv_spinner: false,
                from: '',
                to: '',
                allData: [],
                minData: [],
                kdvData: [],
            };
        },
        computed: {
            ...mapState('layout', ['users']),
        },
        mounted() {
            this.setDefaultDates();
        },
        methods: {
            getSumForItem(item) {
                let totalSum = item.tasks.reduce((sum, task) => {
                    const facesCount = Number(task.faces_count) || 0;
                    const devicesCount = Number(task.devices_count) || 0;
                    const contactsCount = Number(task.contacts_count) || 0;
                    // Специальное условие для задач с типом "Кадровая работа" (type_id: 12)
                    if (task.type_id === 12) {
                        sum += facesCount;
                    } else {
                        // Увеличиваем сумму по задачам
                        sum += facesCount + devicesCount + contactsCount;
                        // Проверяем, если все привязанные поля равны нулю
                        if (facesCount === 0 && devicesCount === 0 && contactsCount === 0) {
                            // Если все нули, добавляем +1 к количеству контактов
                            sum += 1;
                        }
                    }
                    return sum;
                }, 0);
                return totalSum;
            },
            formatDateBase(item) {
                return formatDate(item);
            },
            async baseReportGet() {
                try {
                    this.allData = [];
                    const response = await this.$axios.post('api/reports/base', {from: this.from, to: this.to});
                    if (response) {
                        this.all_spinner = false;
                        this.allData = response.data.types;

                    }
                    // this.form.customer_id = response.data.id;
                } catch (error) {
                    console.error('Error adding item:', error);
                }
            },
            generate() {
                this.all_spinner = true;
                this.min_spinner = true;
                this.kdv_spinner = true;
                this.baseReportGet();
            },
            setDefaultDates() {
                const today = new Date();
                const startOfWeek = new Date(today);
                // Определение начала недели (понедельник)
                const dayOfWeek = today.getDay();
                const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Если воскресенье, то устанавливаем на понедельник
                startOfWeek.setDate(diff);

                // Форматируем даты в 'YYYY-MM-DD'
                this.from = startOfWeek.toISOString().substr(0, 10);
                this.to = today.toISOString().substr(0, 10);
            },
            submitFilter() {
                // Ваш метод для обработки фильтрации
                console.log('Фильтр с:', this.from, 'по:', this.to);
            }
        }
    }
</script>

<style>
    .block-list {
        font-size: 14px;
        font-family: "Helvetica Neue", Arial, sans-serif;
    }
    .v-application p {
        margin-bottom: 8px;
    }
    .spinner {
        text-align: center;
        padding-top: 20px;
    }
    .table-header {
        font-size: 22px;
        margin-top: 25px;
        text-align: center;
    }
</style>
