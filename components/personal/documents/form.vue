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
                <v-alert
                        v-if="open_document_id && document"
                        dense
                        type="info"
                >
                    Документ № {{document.id}}
                </v-alert>
                <v-alert
                        v-else
                        dense
                        type="info"
                >
                    Создать документ
                </v-alert>
                <v-tabs v-model="tab">
                    <v-tab href="#tab-1">
                        Общее
                    </v-tab>
                    <v-tab href="#tab-2" v-if="open_document_id">
                        Контакты <span v-if="contact_count">&nbsp;({{ contact_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-3" v-if="open_document_id">
                        Устройство <span v-if="device_count">&nbsp;({{ device_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-4" v-if="open_document_id">
                        Лицо <span v-if="face_count">&nbsp;({{ face_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-5" v-if="open_document_id">
                        Результат
                    </v-tab>
                    <v-tab href="#tab-6" v-if="open_document_id">
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
                                                    label="Подразделение-заказчик"
                                                    :error-messages="error ? errors.data.group_id: ''"
                                            ></v-autocomplete>
                                        </v-col>
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    label="Исполнитель-заказчик"
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

                                        <v-col cols="5" md="5">
                                            <v-checkbox
                                                    v-model="form.control"
                                                    label="На контроле руководства"
                                                    color="green"
                                                    dense
                                            ></v-checkbox>
                                        </v-col>
                                        <v-col cols="2" md="2">
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
                                                    outlined
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="5" md="5">
                                            <v-text-field
                                                    label="Документ создан"
                                                    v-model="creator"
                                                    dense
                                                    disabled
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="7" md="7">
                                            <v-select
                                                    v-if="users && isAdmin"
                                                    v-model="form.users"
                                                    :items="users"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Исполнители документа"
                                                    multiple
                                                    item-value="id"
                                                    item-text="name"
                                                    dense
                                            ></v-select>
                                            <v-select
                                                    v-else
                                                    v-model="form.users"
                                                    :items="users"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Исполнители документа"
                                                    multiple
                                                    item-value="id"
                                                    item-text="name"
                                                    dense
                                                    disabled
                                            ></v-select>

                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-2">
                        <v-card flat class="d-flex justify-end">
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-btn color="info" @click="openContactDialog(false)" dark small
                                               class="float-end">
                                            <v-icon left>mdi mdi-plus</v-icon>
                                            контакт
                                            <!--                                            <v-icon small>mdi mdi-at</v-icon>-->
                                        </v-btn>
                                        <contact-form :dialog="contactDialog"/>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-if="document && document.contacts">
                                        <v-data-table
                                                :headers="contact_headers"
                                                :items="document.contacts"
                                                item-key="id"
                                                class="elevation-1 my-2"
                                                :loading="removeLoader"
                                                loading-text="Загрузка данных... Пожалуйста ожидайте"
                                                :items-per-page=8
                                        >
                                            <template v-slot:item.number="{ item, index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.icon="{ item }">
                                                <v-img :src="item.type.icon" width="24"/>
                                            </template>
                                            <template v-slot:item.code="{ item }">
                                                <template v-if="item.code">
                                                    {{ item.name }} <br>
                                                    {{ item.code }}
                                                </template>
                                                <template v-else>
                                                    {{ item.name }}
                                                </template>
                                            </template>
                                            <template v-slot:item.action="{ item }">
                                                <v-icon style="cursor:pointer" @click="openContactDialog(item.id)">
                                                    mdi-pencil
                                                </v-icon>
                                                <v-icon style="cursor:pointer"
                                                        @click="removeLink(item.id, document.id)">mdi mdi-close
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-3">
                        <v-card-text>
                            <v-row>
                                <v-col v-if="document && document.devices">
                                    <v-btn color="info" @click="openDeviceDialog(false)" dark small class="float-end">
                                        <v-icon left>mdi mdi-plus</v-icon>
                                        устройство
                                    </v-btn>
                                    <device-form :dialog="deviceDialog"/>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col v-if="document && document.devices">
                                    <v-data-table
                                            :headers="device_headers"
                                            :items="document.devices"
                                            item-key="id"
                                            class="elevation-1 my-2"
                                            :loading="removeLoader"
                                            loading-text="Загрузка данных... Пожалуйста ожидайте"
                                            :items-per-page=8
                                    >
                                        <template v-slot:item.number="{ item, index }">
                                            {{ index + 1 }}
                                        </template>
                                        <template v-slot:item.action="{ item }">
                                            <v-icon style="cursor:pointer" @click="openDeviceDialog(item.id)">
                                                mdi-pencil
                                            </v-icon>
                                            <v-icon style="cursor:pointer"
                                                    @click="removeDeviceLink(item.id, document.id)">mdi mdi-close
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item value="tab-4">
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-btn color="info" @click="openFaceDialog(false)" dark small class="float-end">
                                        <v-icon left>mdi mdi-plus</v-icon>
                                        лицо
                                        <!--                                        <v-icon small>mdi mdi-account-check</v-icon>-->
                                    </v-btn>
                                    <face-form :dialog="faceDialog"/>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col v-if="document && document.faces">
                                    <v-data-table
                                            :headers="face_headers"
                                            :items="document.faces"
                                            item-key="id"
                                            class="elevation-1 my-2"
                                            :loading="removeLoader"
                                            loading-text="Загрузка данных... Пожалуйста ожидайте"
ы                                            :items-per-page=8
                                    >
                                        <template v-slot:item.number="{ item, index }">
                                            {{ index + 1 }}
                                        </template>
                                        <template v-slot:item.birthday="{ item }">
                                            {{ formatBirthday(item.birthday) }}
                                        </template>
                                        <template v-slot:item.action="{ item }">
                                            <v-icon style="cursor:pointer" @click="openFaceDialog(item.id)">
                                                mdi-pencil
                                            </v-icon>
                                            <v-icon style="cursor:pointer"
                                                    @click="removeFaceLink(item.id, document.id)">mdi mdi-close
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item value="tab-5">
                        <v-card flat>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-textarea
                                                v-model="form.result"
                                                outlined
                                                name="input-7-4"
                                                label="Результат выполнения документа"
                                                dense
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="6" md="6">
                                        <v-file-input
                                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                placeholder="Выберите файл"
                                                prepend-icon="mdi mdi-paperclip-check"
                                                label="Файлы результата"
                                                v-model="form.results"
                                                multiple
                                        ></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-if="document && document.media && result_files && result_files.length > 0">
                                        <v-data-table
                                                :headers="result_headers"
                                                :items="result_files"
                                                item-key="id"
                                                class="elevation-1 my-2"
                                                :loading="removeLoader"
                                                loading-text="Загрузка данных... Пожалуйста ожидайте"
                                                hide-default-footer
                                                :items-per-page=15
                                        >
                                            <template v-slot:item.number="{ item, index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.filename="{ item }">
                                                {{ item.file_name }}
                                            </template>
                                            <template v-slot:item.created_at="{ item }">
                                                {{ dateTime(item.created_at) }}
                                            </template>
                                            <template v-slot:item.action="{ item }">
                                                <a :href="item.original_url"><v-icon>mdi mdi-download</v-icon></a>
                                                <v-icon style="cursor:pointer"
                                                        @click="removeFile(item.id, document.id)">mdi mdi-close
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-6">
                        <v-card flat v-if="open_document_events">
                            <v-card-text>
                                <v-simple-table height="520" fixed-header="true">
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th class="text-left">
                                                Дата
                                            </th>
                                            <th class="text-left">
                                                Событие
                                            </th>
                                            <th class="text-left">
                                                Пользователь
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr
                                                v-for="item in open_document_events"
                                                :key="item.id"
                                        >
                                            <td>{{ item.formatted_created_at }}</td>
                                            <td>{{ item.title }}</td>
                                            <td>{{ item.user.name }}</td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
                <v-card tile>
                    <div v-if="errors && errors.success === false || success.length > 0">
                        <v-alert
                                v-if="errors.success === false"
                                text
                                type="error"
                        >
                            {{ errors.message }}
                        </v-alert>
                        <v-alert
                                v-if="!error && success.length > 0"
                                text
                                type="success"
                        >
                            {{ success }}
                        </v-alert>
                    </div>
                    <v-card-actions>
                        <v-chip :style="{backgroundColor:document.status.color }"
                                v-if="document && document.status && document.status.color"
                                dark
                                label
                                class="mt-1 mb-1"
                                variant="outlined"
                        >
                            <v-icon dark left small>{{ document.status.icon }}</v-icon>
                            {{ document.status.title }} {{ document.formatted_execution_date }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <v-btn
                                v-if="document && document.status_id === 1"
                                color="red darken-2"
                                text
                                @click="setStatus(2)"
                        >
                            В работу
                        </v-btn>
                        <v-btn
                                v-if="document && document.status_id === 2"
                                color="red darken-2"
                                text
                                @click="setStatus(3)"
                        >
                            Завершить
                        </v-btn>
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
    import {filterMediaByCollection, formatDate, formatDateTime, toDay} from '../../../plugins/helpers.js'
    import ContactForm from "../../modal/ContactForm";
    import DeviceForm from "../../modal/DeviceForm";
    import FaceForm from "../../modal/FaceForm";
    import ImagePreview from "../../imagePreview";

    export default {
        name: "DocumentForm",
        components: {ImagePreview, FaceForm, DeviceForm, ContactForm},
        data() {
            return {
                removeLoader: false,
                tab: null,
                contact_headers: [
                    {text: '', value: 'number', sortable: false},
                    {text: '', value: 'icon', sortable: false},
                    {text: 'Тип контакта', value: 'type.type', sortable: false},
                    {text: 'Контакт', value: 'code', sortable: false},
                    {text: '', value: 'action', sortable: false, width: '85'},
                ],
                device_headers: [
                    {text: '', value: 'number', sortable: false},
                    {text: 'Тип устройства', value: 'type.title', sortable: false},
                    {text: 'Модель', value: 'model', sortable: false},
                    {text: 'ОС', value: 'os', sortable: false},
                    {text: 'S/N', value: 'sn', sortable: false},
                    {text: '', value: 'action', sortable: false, width: '85'},
                ],
                face_headers: [
                    {text: '', value: 'number', sortable: false},
                    {text: 'ФИО', value: 'full_name', sortable: false},
                    {text: 'Дата рождения', value: 'birthday', sortable: false},
                    {text: 'Адрес', value: 'address', sortable: false},
                    {text: '', value: 'action', sortable: false, width: '85'},
                ],
                result_headers: [
                    {text: '', value: 'number', sortable: false},
                    {text: 'Имя файла', value: 'filename', sortable: false},
                    {text: 'Дата добавления', value: 'created_at', sortable: false},
                    {text: '', value: 'action', sortable: false, width: '85'},
                ],
                // форма
                result_files: [],
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
                    executor: "",
                    control: false,
                    users: [],
                    results: []
                }
            }
        },
        computed: {
            ...mapState('documents', ['groups', 'task_types', 'form_loading', 'error', 'errors', 'success',
                'open_document_id', 'document', 'open_document_events', 'filter_data'
            ]),
            ...mapState('contacts', ['contactDialog']),
            ...mapState('devices', ['deviceDialog']),
            ...mapState('faces', ['faceDialog']),
            ...mapState('layout', ['users']),

            user_id() {
                return this.$auth.user.id;
            },
            isAdmin() {
                return this.$auth.user.isAdmin
            },
            creator() {
                if (this.document && this.document.creator && this.document.creator.name && this.document.formatted_created_at) {
                    return this.document.creator.name + ", " + this.document.formatted_created_at
                }
            },
            currentUserId() {
                return this.$auth.user.id;
            },
            contact_count(){
                if(this.document && this.document.contacts){
                    return this.document.contacts.length
                }
            },
            device_count(){
                if(this.document && this.document.devices) {
                    return this.document.devices.length
                }
            },
            face_count(){
                if(this.document && this.document.faces){
                    return this.document.faces.length
                }
            },
        },
        props: ['dialog'],
        mounted() {
            if (!this.open_document_id) {
                this.form.incoming_date = toDay();
                this.changeIncomingDate();
                this.form.users[0] = this.$auth.user.id
            }
        },
        watch: {
            document(value) {
                if (value) {
                    this.form.outgoing_number = value.outgoing_number;
                    this.form.outgoing_date = value.formatted_outgoing_doc_date;
                    this.form.incoming_number = value.incoming_number;
                    this.form.incoming_date = value.formatted_incoming_date;
                    this.form.group_id = value.group_id;
                    this.form.type_id = value.type_id;
                    this.form.users = value.users.map(user => user.id);
                    this.form.quickly = value.quickly;
                    this.form.deanon = value.deanon;
                    this.form.deanon_success_count = value.deanon_success_count ? value.deanon_success_count : 0;
                    this.form.deadline_date = value.formatted_deadline_date;
                    this.form.comment = value.comment;
                    this.form.result = value.result;
                    this.form.execution_date = value.execution_date ? value.execution_date : null;
                    this.form.executor = value.executor;
                    this.form.control = value.control;
                    this.form.status_id = value.status_id;
                    if (value.media){
                        this.result_files = filterMediaByCollection(value.media, 'results');
                    }
                }
                //
            }
        },
        methods: {
            formatBirthday(item) {
                return formatDate(item)
            },
            dateTime(item) {
                return formatDateTime(item)
            },
            openContactDialog(id) {
                this.$store.commit('contacts/SET_DIALOG');
                if (id) {
                    this.$store.dispatch('contacts/GET_CONTACT_FROM_API', id);
                }
            },
            openDeviceDialog(id) {
                this.$store.commit('devices/SET_DEVICE_DIALOG');
                if (id) {
                    this.$store.dispatch('devices/GET_DEVICE_FROM_API', id);
                }
            },
            openFaceDialog(id) {
                this.$store.commit('faces/SET_FACE_DIALOG');
                if (id) {
                    this.$store.dispatch('faces/GET_FACE_FROM_API', id);
                }
            },
            async setStatus(status_id) {
                this.$store.commit('documents/CHANGE_DOC_STATUS', status_id);
                let url = '/api/documents/' + this.open_document_id + '/status/' + status_id + '/' + this.user_id;
                const response = await this.$axios.$post(url);
            },
            async removeLink(contact_id, document_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('document_id', document_id);
                formData.append('contact_id', contact_id);
                const response = await this.$axios.$post('/api/documents/remove-contact-doc', formData);
                if (response) {
                    const documentResponse = await this.$axios.get(`/api/documents/${document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                    this.removeLoader = false;
                }
            },
            async removeDeviceLink(device_id, document_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('document_id', document_id);
                formData.append('device_id', device_id);
                const response = await this.$axios.$post('/api/documents/remove-device-doc', formData);
                if (response) {
                    const documentResponse = await this.$axios.get(`/api/documents/${document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                    this.removeLoader = false;
                }
            },
            async removeFaceLink(face_id, document_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('document_id', document_id);
                formData.append('face_id', face_id);
                const response = await this.$axios.$post('/api/documents/remove-face-doc', formData);
                if (response) {
                    const documentResponse = await this.$axios.get(`/api/documents/${document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                    this.removeLoader = false;
                }
            },
            async removeFile(file_id, document_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('photo_id', file_id);
                const response = await this.$axios.$post('/api/media/remove', formData);
                if (response) {
                    const documentResponse = await this.$axios.get(`/api/documents/${document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                    this.removeLoader = false;
                }
            },
            clearFields() {
                this.form.outgoing_number = "";
                this.form.outgoing_date = "";
                this.form.incoming_number = "";
                this.form.incoming_date = "";
                this.form.group_id = "";
                this.form.type_id = 1;
                this.form.status_id = 1;
                this.form.users = this.$auth.user.id;
                this.form.quickly = false;
                this.form.deanon = false;
                this.form.deanon_success_count = "";
                this.form.deadline_date = "";
                this.form.comment = "";
                this.form.result = "";
                this.form.execution_date = "";
                this.form.executor = "";
                this.form.control = false
                this.form.results = [];
            },
            async close() {
                this.$store.commit('documents/SET_DIALOG');
                this.$store.commit('documents/ERROR_OFF')
                this.$store.commit('documents/ERRORS_STORE', [])
                this.$store.commit('documents/SUCCESS_STORE', [])
                this.$store.commit('documents/SET_OPEN_DOC_ID', null)
                this.$store.commit('documents/STORE_DOCUMENT', []);
                this.$store.commit('documents/STORE_EVENTS', []);
                this.clearFields();
                if (!this.open_document_id) {
                    this.form.incoming_date = toDay();
                    this.changeIncomingDate();
                }

            },
            async save() {
                const formData = new FormData();
                for (const [key, value] of Object.entries(this.form)) {
                    formData.append(key, value);
                }
                this.form.results.forEach((file) => {
                    formData.append('results[]', file);
                });
                formData.append('user_id', this.user_id);
                formData.append('quickly', this.form.quickly ? 1 : 0);
                formData.append('deanon', this.form.deanon ? 1 : 0);
                formData.append('control', this.form.control ? 1 : 0);
                if (this.open_document_id) {
                    formData.append('open_document_id', this.open_document_id);
                    await this.$store.dispatch('documents/UPDATE_DOCUMENT', formData)
                    const documentResponse = await this.$axios.get(`/api/documents/${this.open_document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                    this.form.results = []
                } else {
                    await this.$store.dispatch('documents/CREATE_DOCUMENT', formData)
                    this.form.results = []
                    await this.$store.dispatch('documents/GET_DOCUMENTS_FROM_API', [this.filter_data, this.currentUserId, 1]);
                }
            },
            changeQuickly() {
                if (this.form.incoming_date) {
                    if (this.form.quickly === true) {
                        const startDate = new Date(this.form.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 3);
                        this.form.deadline_date = endDate.toISOString().split('T')[0];
                    } else {
                        const startDate = new Date(this.form.incoming_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 21);
                        this.form.deadline_date = endDate.toISOString().split('T')[0];
                    }
                } else {
                    this.form.deadline_date = '';
                }
            },
            changeIncomingDate() {
                if (this.form.incoming_date) {
                    const startDate = new Date(this.form.incoming_date);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 21);
                    this.form.deadline_date = endDate.toISOString().split('T')[0];
                } else {
                    this.form.deadline_date = '';
                }
            },
        }
    }
</script>

<style>
    .quickly label {
        color: red !important;
    }

    .v-alert {
        margin-bottom: 0 !important;
    }

    .v-dialog:not(.v-dialog--fullscreen) {
        max-height: 95%;
    }
</style>
