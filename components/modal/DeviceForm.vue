<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="560px"
        >
            <v-card
                    v-if="edit_device_loading"
                    color="primary"
                    dark
            >
                <v-card-text>
                    Загрузка...
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
            <div v-else>
                <v-tabs v-model="tab">
                    <v-tab href="#tab-1" v-if="!form_editing">
                        Новое устройство
                    </v-tab>
                    <v-tab href="#tab-1" v-else>
                        <v-icon small>mdi-pencil</v-icon> <span style="width: 10px"></span>ID#{{ device.id }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" style="min-height: 595px">
                    <v-tab-item value="tab-1">
                        <v-card flat>
                            <v-card-text>
                                <div v-if="errors && errors.success === false || success.length > 0">
                                    <v-alert
                                            v-if="errors.success === false"
                                            dense
                                            outlined
                                            type="error"
                                            class="ml-1 mr-1"
                                    >
                                        {{ errors.message }}
                                    </v-alert>
                                    <v-alert
                                            v-if="!error && success.length > 0"
                                            dense
                                            outlined
                                            type="success"
                                            class="ml-1 mr-1"
                                    >
                                        {{ success }}
                                    </v-alert>
                                </div>
                                <v-container>
                                    <v-row>
                                        <v-col cols="6" md="6" v-if="device_types">
                                            <v-autocomplete
                                                    v-model="form.type_id"
                                                    :items="device_types"
                                                    item-value="id"
                                                    item-text="title"
                                                    label="Тип устройства *"
                                                    :error-messages="error ? errors.data.type_id: ''"
                                            ></v-autocomplete>
                                        </v-col>
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    label="Модель устройства *"
                                                    required
                                                    v-model="form.model"
                                                    :error-messages="error ? errors.data.model: ''"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    label="Версия ОС"
                                                    required
                                                    v-model="form.os"
                                                    :error-messages="error ? errors.data.os: ''"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    label="Серийный номер"
                                                    required
                                                    v-model="form.sn"
                                                    :error-messages="error ? errors.data.sn   : ''"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-textarea
                                                    v-model="form.comment"
                                                    outlined
                                                    name="input-7-4"
                                                    dense
                                                    label="Коментарий"
                                            ></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
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
                                v-if="!selectType"
                                color="success"
                                co text
                                @click="save()"
                                :loading="form_loading"
                                disabled
                        >
                            Сохранить
                        </v-btn>
                        <v-btn
                                v-else
                                color="success"
                                co text
                                @click="save()"
                                :loading="form_loading"
                        >
                            Сохранить
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-dialog>
    </v-row>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "DeviceForm",
        data() {
            return {
                tab: null,
                selectType: false,
                form_editing: false,
                form: {
                    type_id: "",
                    model: "",
                    os: "",
                    sn: "",
                    comment: "",
                }
            }
        },
        computed: {
            ...mapState('devices', ['device','errors', 'success', 'form_loading', 'error', 'edit_device_loading']),
            ...mapState('layout', ['device_types']),
            ...mapState('documents', ['open_document_id']),
            ...mapState('tasks', ['open_task_id']),
            user_id() {
                return this.$auth.user.id;
            },
            progress() {
                return Math.min(100, this.value.length * 10)
            },
            color() {
                return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
            },

        },
        props: ['dialog'],
        watch: {
            'form.type_id': function (newVal) {
                this.selectType = !!newVal;
            },
            device(value) {
                if (value) {
                    this.form_editing = true
                    this.form.type_id = value.type_id
                    this.form.model = value.model
                    this.form.os = value.os
                    this.form.sn = value.sn
                    this.form.comment = value.comment
                }
            }
        },
        methods: {
            clearFields() {
                this.form.type_id = "";
                this.form.model = "";
                this.form.os = "";
                this.form.sn = "";
                this.form.comment = "";
                this.form_editing = false;
            },
            async save() {
                const formData = new FormData();
                for (const [key, value] of Object.entries(this.form)) {
                    formData.append(key, value);
                }
                if (this.open_document_id) {
                    formData.append('document_id', this.open_document_id);
                }
                if (this.open_task_id) {
                    formData.append('task_id', this.open_task_id);
                }
                formData.append('user_id', this.user_id);
                if(this.form_editing) {
                    await this.$store.dispatch('devices/UPDATE_DEVICE', formData)
                }else{
                    await this.$store.dispatch('devices/CREATE_DEVICE', formData)
                }

                if(this.open_document_id){
                    const documentResponse = await this.$axios.get(`/api/documents/${this.open_document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                }
                if(this.open_task_id){
                    const documentResponse = await this.$axios.get(`/api/tasks/${this.open_task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', documentResponse);
                }
                this.clearFields()
            },
            async close() {
                this.form_editing = false
                this.$store.commit('devices/SET_DEVICE_DIALOG');
                this.$store.commit('contacts/ERROR_OFF');
                this.$store.commit('contacts/ERRORS_STORE', []);
                this.$store.commit('contacts/SUCCESS_STORE', []);
                this.clearFields()
            },
        }
    }
</script>

<style>
    .quickly label {
        color: red !important;
    }

    .icons {
        display: flex;
    }

    .v-icon-a {
        margin-right: 10px;
        cursor: pointer;
    }

    .scrollable-container {
        max-height: 300px; /* Установите нужную высоту */
        overflow-y: auto; /* Включите вертикальную прокрутку */
        padding-right: 16px; /* Добавьте отступ, чтобы не скрывать правую часть содержимого */
    }
</style>
