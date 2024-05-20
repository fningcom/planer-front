<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="720px"
        >
            <v-card v-if="errors && errors.success === false || success.length > 0">
                   <v-card-text>
                    <v-alert
                            v-if="errors.success === false"
                            dense
                            outlined
                            type="error"
                    >
                        {{ errors.message }}
                    </v-alert>
                    <v-alert
                            v-if="!error && success.length > 0"
                            dense
                            outlined
                            type="success"
                    >
                        {{ success }}
                    </v-alert>
                </v-card-text>
            </v-card>
            <v-tabs v-model="tab">
                <v-tab href="#tab-1">
                    Основная информация
                </v-tab>
                <v-tab href="#tab-2">
                    Объекты
                </v-tab>
                <v-tab href="#tab-3">
                    Файлы
                </v-tab>
                <v-tab href="#tab-4">
                    История
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="min-height: 595px">
                <v-tab-item value="tab-1">
                    <v-card flat>
                        <v-card-text>

                            <v-container>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                label="Исходящий номер документа"
                                                append-icon="mdi mdi-arrow-top-right"
                                                color="red"
                                                required
                                                v-model="outgoing_number"
                                                :error-messages="error ? errors.data.outgoing_number: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                type="date"
                                                label="Дата исходящего номера"
                                                required
                                                v-model="outgoing_date"
                                                :error-messages="error ? errors.data.outgoing_date: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                label="Входящий номер документа"
                                                required
                                                append-icon="mdi mdi-arrow-bottom-left"
                                                v-model="incoming_number"
                                                :error-messages="error ? errors.data.incoming_number: ''"
                                                dense
                                                color="#66BB6A"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                type="date"
                                                label="Дата входящего номера"
                                                required
                                                v-model="incoming_date"
                                                :error-messages="error ? errors.data.incoming_date: ''"
                                                dense
                                                @change="changeIncomingDate"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-autocomplete
                                                v-model="group_id"
                                                :items="groups"
                                                item-value="title"
                                                dense
                                                label="Подразделение"
                                        ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-autocomplete
                                                v-model="type_id"
                                                :items="task_types"
                                                item-value="title"
                                                dense
                                                label="Тип задачи"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                type="date"
                                                label="Срок исполнения"
                                                required
                                                v-model="deadline_date"
                                                :error-messages="error ? errors.data.deadline_date: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="3" md="3" class="quickly">
                                        <v-checkbox
                                                v-model="quickly"
                                                label="↯ Срочно"
                                                color="red"
                                                dense
                                                @change="changeQuickly"
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-textarea
                                                outlined
                                                name="input-7-4"
                                                label="Коментарий"
                                                dense
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="3" md="3">
                                        <v-checkbox
                                                v-model="deanon"
                                                label="Деанон"
                                                dense
                                        ></v-checkbox>
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                                type="number"
                                                label="Число успешных деанонов"
                                                required
                                                v-model="deanon_success_count"
                                                :error-messages="error ? errors.data.deanon_success_count: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="tab-2">
                    <v-card flat>
                        <v-card-text>2</v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="tab-3">
                    <v-card flat>
                        <v-card-text>3</v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="tab-4">
                    <v-card flat>
                        <v-card-text>4</v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
            <v-card tile>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="blue darken-1"
                            text
                            @click="close()"
                    >
                        Закрыть
                    </v-btn>
                    <v-btn
                            color="success"
                            co text
                            @click="save()"
                            :loading="form_loading"
                    >
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-row>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "vForm",
        data() {
            return {
                error: false,
                errors: '',
                success: '',
                tab: null,
                // форма
                status_id: 1,
                outgoing_number: "",
                outgoing_date: "",
                incoming_number: "",
                incoming_date: "",
                group_id: "",
                type_id: "",
                user_id: "",
                quickly: false,
                deanon: false,
                deanon_success_count: "",
                deadline_date: "",
                comment: '',
                execution_date: "",
                executor: ""
            }
        },
        computed: {
            ...mapState('documents', ['groups', 'task_types','form_loading']),
        },
        props: ['dialog'],
        methods: {
            async close() {
                this.$store.commit('documents/SET_DIALOG');
            },
            async save() {
                await this.$store.dispatch('documents/CREATE_DOCUMENT', this.user._id)
            },
            changeQuickly(){
                if (this.incoming_date) {
                    if(this.quickly === true){
                        const startDate = new Date(this.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 3);
                        this.deadline_date = endDate.toISOString().split('T')[0];
                    }else{
                        const startDate = new Date(this.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 21);
                        this.deadline_date = endDate.toISOString().split('T')[0];
                    }
                } else {
                    this.deadline_date = '';
                }
            },
            changeIncomingDate(){
                if (this.incoming_date) {
                    const startDate = new Date(this.incoming_date);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 21);
                    this.deadline_date = endDate.toISOString().split('T')[0];
                } else {
                    this.deadline_date = '';
                }
            }
        }
    }
</script>

<style >
.quickly label {
    color: red!important;
}
</style>
