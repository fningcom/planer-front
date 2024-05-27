<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="720px"
        >
            <v-card
                    v-if="open_document_id && !document"
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
                <v-tab href="#tab-1">
                    Основная информация
                </v-tab>
                <v-tab href="#tab-2">
                    Контакты
                </v-tab>
<!--                <v-tab href="#tab-2" v-if="open_document_id">-->
<!--                    Объекты-->
<!--                </v-tab>-->
                <v-tab href="#tab-3" v-if="open_document_id">
                    Файлы
                </v-tab>
                <v-tab href="#tab-4" v-if="open_document_id">
                    История
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="min-height: 595px">
                <v-tab-item value="tab-1">
                    <v-card flat>
                        <v-card-text>
                            <div v-if="errors && errors.success === false || success.length > 0" >
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
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                label="Исходящий номер документа"
                                                append-icon="mdi mdi-arrow-top-right"
                                                color="red"
                                                required
                                                v-model="form.outgoing_number"
                                                :error-messages="error ? errors.data.outgoing_number: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                type="date"
                                                label="Дата исходящего номера"
                                                required
                                                v-model="form.outgoing_date"
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
                                                v-model="form.incoming_number"
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
                                                v-model="form.incoming_date"
                                                :error-messages="error ? errors.data.incoming_date: ''"
                                                dense
                                                @change="changeIncomingDate"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-autocomplete
                                                v-model="form.group_id"
                                                :items="groups"
                                                item-value="id"
                                                item-text="title"
                                                dense
                                                label="Подразделение"
                                                :error-messages="error ? errors.data.group_id: ''"
                                        ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-text-field
                                                label="Исполнитель"
                                                required
                                                v-model="form.executor"
                                                :error-messages="error ? errors.data.executor: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" md="6">
                                        <v-autocomplete
                                                v-model="form.type_id"
                                                :items="task_types"
                                                item-value="id"
                                                item-text="title"
                                                dense
                                                label="Тип задачи"
                                                :error-messages="error ? errors.data.type_id: ''"
                                        ></v-autocomplete>

                                    </v-col>
                                    <v-col cols="3" md="3">
                                        <v-text-field
                                                type="date"
                                                label="Срок исполнения"
                                                required
                                                v-model="form.deadline_date"
                                                :error-messages="error ? errors.data.deadline_date: ''"
                                                dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="3" md="3">
                                        <v-checkbox
                                                v-model="form.quickly"
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
                                                v-model="form.comment"
                                                outlined
                                                name="input-7-4"
                                                label="Коментарий"
                                                dense
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="3" md="3">
                                        <v-checkbox
                                                v-model="form.deanon"
                                                label="Деанон"
                                                dense
                                        ></v-checkbox>
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                                type="number"
                                                label="Число успешных деанонов"
                                                required
                                                v-model="form.deanon_success_count"
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
                    <v-card flat class="d-flex justify-end">
                        <v-card-text>
                            <v-btn color="info" @click="openContactDialog" dark small class="float-end">
                                <v-icon left>mdi mdi-plus</v-icon> контакт
                            </v-btn>
                            <v-contact-form :dialog="contactDialog"/>
                        </v-card-text>
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
            </div>
        </v-dialog>
    </v-row>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapFields} from "@/plugins/helpers"
    import {toDay} from "../../../plugins/helpers";
    import VContactForm from "../contacts/vContactForm";
    export default {
        name: "vForm",
        components: {VContactForm},
        data() {
            return {
                tab: null,
                // форма
                form: {
                    status_id: 1,
                    outgoing_number: "",
                    outgoing_date: "",
                    incoming_number: "",
                    incoming_date: "",
                    group_id: "",
                    type_id: 1,
                    quickly: false,
                    deanon: false,
                    deanon_success_count: 0,
                    deadline_date: "",
                    comment: '',
                    execution_date: "",
                    executor: ""
                }
            }
        },
        computed: {
            ...mapState('documents', ['groups', 'task_types','form_loading','error', 'errors', 'success', 'open_document_id', 'document']),
            ...mapState('contacts', ['contactDialog']),
            // ...mapFields({
            //     fields: ["outgoing_number", "outgoing_date", "incoming_number", "incoming_date", "group_id", "type_id", "quickly", "deanon", "user_id"],
            //     store: "documents",
            //     base: "document",
            //     mutation: "UPDATE_DOCUMENT_FIELD",
            // }),
            user_id() {
                return this.$auth.user.id;
            }
        },
        props: ['dialog'],
        mounted() {
            if(!this.open_document_id){
                this.form.incoming_date = toDay();
                this.changeIncomingDate();
            }
        },
        watch: {
            document(value){
                if(value){
                    this.form.outgoing_number = value.outgoing_number
                    this.form.outgoing_date = value.formatted_outgoing_doc_date
                    this.form.incoming_number = value.incoming_number
                    this.form.incoming_date = value.formatted_incoming_date
                    this.form.group_id = value.group_id
                    this.form.type_id = value.type_id
                    this.form.quickly = value.quickly
                    this.form.deanon = value.deanon
                    this.form.deanon_success_count = value.deanon_success_count ? value.deanon_success_count: 0
                    this.form.deadline_date = value.formatted_deadline_date
                    this.form.comment = value.comment
                    this.form.execution_date = value.formatted_execution_date ? value.formatted_execution_date: null
                    this.form.executor = value.executor
                }
                //
            }
        },
        methods: {
            clearFields(){
                this.form.outgoing_number = ""
                this.form.outgoing_date = ""
                this.form.incoming_number =""
                this.form.incoming_date = ""
                this.form.group_id = ""
                this.form.type_id = 1
                this.form.quickly = false
                this.form.deanon = false
                this.form.deanon_success_count = ""
                this.form.deadline_date = ""
                this.form.comment = ""
                this.form.execution_date = ""
                this.form.executor = ""
            },
            async close() {
                this.$store.commit('documents/SET_DIALOG');
                this.$store.commit('documents/ERROR_OFF')
                this.$store.commit('documents/ERRORS_STORE', [])
                this.$store.commit('documents/SUCCESS_STORE', [])
                this.$store.commit('documents/SET_OPEN_DOC_ID', null)
                this.$store.commit('documents/STORE_DOCUMENT', []);
                this.clearFields()
                if(!this.open_document_id){
                    this.form.incoming_date = toDay();
                    this.changeIncomingDate();
                }
                // window.location.reload(true)
            },
            async save() {
                const formData = new FormData();
                for (const [key, value] of Object.entries(this.form)) {
                    formData.append(key, value);
                }
                formData.append('user_id', this.user_id);
                formData.append('quickly', this.form.quickly ? 1 : 0);
                formData.append('deanon', this.form.deanon ? 1 : 0);
                if(this.open_document_id) {
                    formData.append('open_document_id', this.open_document_id);
                    await this.$store.dispatch('documents/UPDATE_DOCUMENT', formData)
                }else{
                    await this.$store.dispatch('documents/CREATE_DOCUMENT', formData)
                }

            },
            changeQuickly(){
                if (this.form.incoming_date) {
                    if(this.form.quickly === true){
                        const startDate = new Date(this.form.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 3);
                        this.form.deadline_date = endDate.toISOString().split('T')[0];
                    }else{
                        const startDate = new Date(this.form.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 21);
                        this.form.deadline_date = endDate.toISOString().split('T')[0];
                    }
                } else {
                    this.form.deadline_date = '';
                }
            },
            changeIncomingDate(){
                if (this.form.incoming_date) {
                    const startDate = new Date(this.form.incoming_date);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 21);
                    this.form.deadline_date = endDate.toISOString().split('T')[0];
                } else {
                    this.form.deadline_date = '';
                }
            },
            openContactDialog(){
                this.$store.commit('contacts/SET_DIALOG');
            }
        }
    }
</script>

<style >
.quickly label {
    color: red!important;
}
</style>
