<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="560px"
        >

            <v-tabs v-model="tab">
                <v-tab href="#tab-1">
                    Новый контакт
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
    import {mapFields} from "@/plugins/helpers"
    import {toDay} from "../../../plugins/helpers";
    export default {
        name: "vContactForm",
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
                    deanon_success_count: "",
                    deadline_date: "",
                    comment: '',
                    execution_date: "",
                    executor: ""
                }
            }
        },
        computed: {
            ...mapState('contacts', ['errors', 'success','form_loading','error']),

            user_id() {
                return this.$auth.user.id;
            }
        },
        props: ['dialog'],
        mounted() {

        },
        methods: {
            async close() {
                this.$store.commit('contacts/SET_DIALOG');
                this.$store.commit('contacts/ERROR_OFF')
                this.$store.commit('contacts/ERRORS_STORE', [])
                this.$store.commit('contacts/SUCCESS_STORE', [])
            },
            async save() {
                const formData = new FormData();
                for (const [key, value] of Object.entries(this.form)) {
                    formData.append(key, value);
                }
                if(this.open_document_id) {
                    formData.append('open_document_id', this.open_document_id);
                }
                formData.append('user_id', this.user_id);
                formData.append('quickly', this.form.quickly ? 1 : 0);
                formData.append('deanon', this.form.deanon ? 1 : 0);
                await this.$store.dispatch('documents/CREATE_DOCUMENT', formData)
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
            }
        }
    }
</script>

<style >
.quickly label {
    color: red!important;
}
</style>
