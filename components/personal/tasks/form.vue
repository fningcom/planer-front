<template>
    <v-row justify="center">
        <face-form :dialog="faceDialog"/>
        <v-dialog
                v-model="dialog"
                persistent
                max-width="880px"
        >

            <v-card
                    v-if="open_task_id && !task"
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
                        v-if="open_task_id && task"
                        dense
                        type="success"
                        color="#4e4caf"
                >
                    Задача № {{task.id}}
                </v-alert>
                <v-alert
                        v-else
                        dense
                        type="info"
                        color="#4e4caf"
                >
                    Создать задачу
                </v-alert>
                <v-tabs v-model="tab">
                    <v-tab href="#tab-1">
                        Общее
                    </v-tab>
                    <v-tab href="#tab-2" v-if="open_task_id">
                        <v-icon small class="tilted-paperclip">mdi mdi-paperclip</v-icon> Файлы <span v-if="files_count">&nbsp;({{ files_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-3" v-if="open_task_id">
                        Контакты <span v-if="contact_count">&nbsp;({{ contact_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-4" v-if="open_task_id">
                        Устройство <span v-if="device_count">&nbsp;({{ device_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-5" v-if="open_task_id">
                        Лицо <span v-if="face_count">&nbsp;({{ face_count }})</span>
                    </v-tab>
                    <v-tab href="#tab-6" v-if="open_task_id">
                        Результат
                    </v-tab>
                    <v-tab href="#tab-7" v-if="open_task_id">
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
                                                    label="Заголовок задачи"
                                                    required
                                                    v-model="form.title"
                                                    :error-messages="error ? errors.data.title: ''"
                                                    dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6" md="6">
                                            <v-autocomplete
                                                    v-model="form.type_id"
                                                    :items="task_types"
                                                    item-value="id"
                                                    item-text="title"
                                                    dense
                                                    label="Тип задачи"
                                                    @change="ChangeType"
                                                    :error-messages="error ? errors.data.type_id: ''"
                                            ></v-autocomplete>
                                        </v-col>
                                        <div v-if="task_subtypes[form.type_id] && task_subtypes[form.type_id].length > 0"
                                             v-for="item in task_subtypes[form.type_id]"
                                             :key="item.id"
                                             style="margin: -19px 0 0 6px;">
                                            <a href="#" class="help" @click.prevent="helpClick(item.title)">{{
                                                item.title }}</a>
                                        </div>
                                        <v-col cols="12" md="12">
                                            <v-textarea
                                                    v-model="form.comment"
                                                    outlined
                                                    name="input-7-4"
                                                    label="Детальное описание задачи"
                                                    dense
                                            ></v-textarea>
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
                                            <v-autocomplete
                                                    v-model="form.customer_id"
                                                    :items="customers"
                                                    :search-input.sync="search"
                                                    @change="onChange"
                                                    :loading="loading"
                                                    :no-data-text="noDataText"
                                                    @blur="addIfNotExists"
                                                    item-value="id"
                                                    item-text="title"
                                                    label="Заказчик"
                                                    dense
                                                    :error-messages="error ? errors.data.customer_id: ''"
                                            ></v-autocomplete>
                                        </v-col>
                                    </v-row>
                                    <v-row>
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
                                        <v-col cols="6" md="6">
                                            <v-checkbox
                                                    v-model="form.control"
                                                    label="На контроле руководства"
                                                    color="green"
                                                    dense
                                            ></v-checkbox>
                                        </v-col>
                                    </v-row>

                                    <v-row>

                                        <v-col cols="2" md="2">
                                            <v-checkbox
                                                    v-model="form.deanon"
                                                    label="Деанон"
                                                    dense
                                            ></v-checkbox>
                                        </v-col>
                                        <v-col cols="4" md="4">
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
                                        <v-col cols="4" md="4">
                                            <v-text-field
                                                    type="number"
                                                    label="Количетсво объектов"
                                                    required
                                                    v-model="form.count"
                                                    :error-messages="error ? errors.data.count: ''"
                                                    dense
                                                    outlined
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="2" md="2" v-if="isAdmin">
                                            <v-checkbox
                                                    v-model="form.fixed"
                                                    label="Fixed"
                                                    dense
                                            ></v-checkbox>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="5" md="5">
                                            <v-text-field
                                                    label="Задача создана"
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
                                                    label="Исполнители задачи"
                                                    multiple
                                                    item-value="id"
                                                    item-text="name"
                                                    dense
                                                    :error-messages="error ? errors.data.users: ''"
                                            ></v-select>
                                            <v-select
                                                    v-else
                                                    v-model="form.users"
                                                    :items="users"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Исполнители задачи"
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
                        <v-card flat>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="5" md="5">
                                            <div>
                                                <v-file-input
                                                        class="att_file"
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        placeholder="Выберите файл"
                                                        prepend-icon="mdi mdi-paperclip-check"
                                                        label="Дополнительные файлы"
                                                        v-model="form.files"
                                                        multiple
                                                ></v-file-input>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                                <div v-for="item in files_files"
                                                     style="display: flex; justify-content: space-between">
                                                    <div>
                                                        <v-icon small class="tilted-paperclip">mdi mdi-paperclip</v-icon>
                                                        <a :href="item.original_url">{{ item.file_name }}</a>
                                                    </div>
                                                    <div style="min-width: 55px;">
                                                        <a :href="item.original_url">
                                                            <v-icon>mdi mdi-download</v-icon>
                                                        </a>
                                                        <v-icon style="cursor:pointer"
                                                                @click="removeFile(item.id, task.id)">mdi mdi-close
                                                        </v-icon>
                                                    </div>
                                                </div>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item value="tab-3">
                        <v-card flat class="d-flex justify-end">
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-btn color="#4e4caf" @click="openContactDialog(false)" dark small
                                               class="float-end">
                                            <v-icon left>mdi mdi-plus</v-icon>
                                            контакт
                                            <!--                                            <v-icon small>mdi mdi-at</v-icon>-->
                                        </v-btn>
                                        <contact-form :dialog="contactDialog"/>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-if="task && task.contacts">
                                        <v-data-table
                                                :headers="contact_headers"
                                                :items="task.contacts"
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
                                                    <div v-if="item.name">&#171;{{ item.name }}&#187;</div>
                                                    <div style="font-size: 12px;">{{ item.code }}</div>
                                                </template>
                                                <template v-else>
                                                    {{ item.name }}
                                                </template>
                                            </template>
                                            <template v-slot:item.related="{ item }">
                                                <v-icon v-if="item.faces_count > 0 || item.related_contacts_count > 0"
                                                        style="color: green"
                                                        @click="openRelationDialog(item.id)">
                                                    mdi mdi-link-variant
                                                </v-icon>
                                            </template>
                                            <template v-slot:item.action="{ item }">
                                                <v-icon style="cursor:pointer" @click="openContactDialog(item.id)">
                                                    mdi-pencil
                                                </v-icon>
                                                <v-icon style="cursor:pointer"
                                                        @click="removeLink(item.id, task.id)">mdi mdi-close
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-4">
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-btn color="#4e4caf" @click="openDeviceDialog(false)" dark small
                                           class="float-end">
                                        <v-icon left>mdi mdi-plus</v-icon>
                                        устройство
                                    </v-btn>
                                    <device-form :dialog="deviceDialog"/>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col v-if="task && task.devices">
                                    <v-data-table
                                            :headers="device_headers"
                                            :items="task.devices"
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
                                                    @click="removeDeviceLink(item.id, task.id)">mdi mdi-close
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item value="tab-5">
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-btn color="#4e4caf" @click="openFaceDialog(false)" dark small class="float-end">
                                        <v-icon left>mdi mdi-plus</v-icon>
                                        лицо
                                        <!--                                        <v-icon small>mdi mdi-account-check</v-icon>-->
                                    </v-btn>

                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col v-if="task && task.faces">
                                    <v-data-table
                                            :headers="face_headers"
                                            :items="task.faces"
                                            item-key="id"
                                            class="elevation-1 my-2"
                                            :loading="removeLoader"
                                            loading-text="Загрузка данных... Пожалуйста ожидайте"
                                            :items-per-page=8
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
                                                    @click="removeFaceLink(item.id, task.id)">mdi mdi-close
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item value="tab-6">
                        <v-card flat>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-textarea
                                                v-model="form.result"
                                                outlined
                                                name="input-7-4"
                                                label="Результат выполнения задачи"
                                                dense
                                        ></v-textarea>
                                        <div style="margin-left: 10px">
                                            <a href="#" class="help"
                                               @click.prevent='addResultHelper("Информации не имеется")'>Информации не
                                                имеется</a>
                                            <a href="#" class="help"
                                               @click.prevent='addResultHelper("Задача успешно выполнена.")'>Задача
                                                успешно выполнена.</a>
                                            <a href="#" class="help"
                                               @click.prevent='addResultHelper("Установить не удалось")'>Установить не
                                                удалось</a>
                                        </div>
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
                                    <v-col v-if="task && task.media && result_files && result_files.length > 0">
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
                                                <a :href="item.original_url">
                                                    <v-icon>mdi mdi-download</v-icon>
                                                </a>
                                                <v-icon style="cursor:pointer"
                                                        @click="removeFile(item.id, task.id)">mdi mdi-close
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-7">
                        <v-card flat v-if="open_task_events">
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
                                                v-for="item in open_task_events"
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
                        <v-chip :style="{backgroundColor:task.status.color }"
                                v-if="task && task.status && task.status.color"
                                dark
                                label
                                class="mt-1 mb-1"
                                variant="outlined"
                        >
                            <v-icon dark left small>{{ task.status.icon }}</v-icon>
                            {{ task.status.title }} {{ task.formatted_execution_date }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <v-btn
                                v-if="task && task.status_id === 1"
                                color="red darken-2"
                                text
                                @click="setStatus(2)"
                        >
                            В работу
                        </v-btn>
                        <v-btn
                                v-if="task && task.status_id === 2"
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
    import ImagePreview from "../../imagePreview";
    import ContactForm from "../../modal/ContactForm";
    import DeviceForm from "../../modal/DeviceForm";
    import FaceForm from "../../modal/FaceForm";

    export default {
        name: "TaskForm",
        components: {FaceForm, DeviceForm, ContactForm, ImagePreview},
        data() {
            return {
                removeLoader: false,
                tab: 0,
                customers: [],
                loading: false,
                search: '',
                noDataText: 'Ничего не найдено',
                contact_headers: [
                    {text: '', value: 'number', sortable: false},
                    {text: '', value: 'icon', sortable: false},
                    {text: 'Тип контакта', value: 'type.type', sortable: false},
                    {text: 'Контакт', value: 'code', sortable: false},
                    {text: 'Связь', value: 'related', sortable: false,  width: '80'},
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
                    {text: 'Гражданство', value: 'citizen', sortable: false},
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
                files_files: [],
                //
                form: {
                    title: "",
                    status_id: 1,
                    group_id: 1,
                    type_id: 1,
                    customer_id: 1,
                    quickly: false,
                    deanon: false,
                    fixed: false,
                    deanon_success_count: 0,
                    count: 0,
                    deadline_date: "",
                    comment: '',
                    result: '',
                    execution_date: "",
                    control: false,
                    users: [],
                    results: [],
                    files: []
                }
            }
        },
        computed: {
            ...mapState('tasks', ['form_loading', 'error', 'errors', 'success',
                'open_task_id', 'task', 'open_task_events', 'filter_data', 'task_subtypes', 'taskDialog'
            ]),
            ...mapState('documents', ['groups', 'task_types']),
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
                if (this.task && this.task.creator && this.task.creator.name && this.task.formatted_created_at) {
                    return this.task.creator.name + ", " + this.task.formatted_created_at
                }
            },
            currentUserId() {
                return this.$auth.user.id;
            },
            contact_count() {
                if (this.task && this.task.contacts) {
                    return this.task.contacts.length
                }
            },
            files_count() {
                if (this.task && this.task.media) {
                    return this.files_files.length
                }
            },
            device_count() {
                if (this.task && this.task.devices) {
                    return this.task.devices.length
                }
            },
            face_count() {
                if (this.task && this.task.faces) {
                    return this.task.faces.length
                }
            },
        },
        props: ['dialog'],
        mounted() {
            if (!this.open_task_id) {
                this.changeIncomingDate();
                this.form.users[0] = this.$auth.user.id
            }
        },
        watch: {
            search(val) {
                this.fetchCustomers(val);
            },
            task(value) {
                if (value) {
                    this.form.group_id = value.group_id;
                    this.form.type_id = value.type_id;
                    this.form.customer_id = value.customer_id;
                    this.form.users = value.users.map(user => user.id);
                    this.form.quickly = value.quickly;
                    this.form.deanon = value.deanon;
                    this.form.fixed = value.fixed;
                    this.form.deanon_success_count = value.deanon_success_count ? value.deanon_success_count : 0;
                    this.form.count = value.count ? value.count : 0;
                    this.form.deadline_date = value.formatted_deadline_date;
                    this.form.comment = value.comment;
                    this.form.result = value.result;
                    this.form.execution_date = value.execution_date ? value.execution_date : null;
                    this.form.control = value.control;
                    this.form.status_id = value.status_id;
                    this.form.title = value.title;
                    if (value.media) {
                        this.result_files = filterMediaByCollection(value.media, 'results');
                        this.files_files = filterMediaByCollection(value.media, 'files');
                    }
                }
                //
            }
        },
        methods: {
            ChangeType() {
                if (!this.open_task_id && (this.form.type_id === 2 || this.form.type_id === 5 || this.form.type_id === 8
                    || this.form.type_id === 9 || this.form.type_id === 10 || this.form.type_id === 11 || this.form.type_id === 14
                    || this.form.type_id === 16 || this.form.type_id === 17)) {
                    this.form.count = 1;
                } else {
                    this.form.count = 0;
                }
            },
            helpClick(value) {
                this.form.title = value;
            },
            addResultHelper(value) {
                this.form.result = value;
            },
            async fetchCustomers(query) {
                this.loading = true;
                try {
                    const response = await this.$axios.get('api/tasks-customers', {
                        params: {q: query}
                    });
                    this.customers = response.data;
                } catch (error) {
                    console.error('Error fetching items:', error);
                } finally {
                    this.loading = false;
                }
            },
            async addIfNotExists() {
                if (!this.customers.find(item => item.title === this.search) && this.search) {
                    try {
                        const response = await this.$axios.post('api/tasks-customers', {title: this.search});
                        this.customers.push(response.data);
                        this.form.customer_id = response.data.id;
                    } catch (error) {
                        console.error('Error adding item:', error);
                    }
                }
            },
            onChange(value) {
                if (!value) {
                    this.search = '';
                }
            },
            // -----------------
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
            openRelationDialog(id) {
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
                this.$store.commit('tasks/CHANGE_TASK_STATUS', status_id);
                let url = '/api/tasks/' + this.open_task_id + '/status/' + status_id + '/' + this.user_id;
                this.form.status_id = status_id;
                this.form.execution_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const response = await this.$axios.$post(url);
            },
            async removeLink(contact_id, task_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('task_id', task_id);
                formData.append('contact_id', contact_id);
                const response = await this.$axios.$post('/api/tasks/remove-contact-task', formData);
                if (response) {
                    const taskResponse = await this.$axios.get(`/api/tasks/${task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', taskResponse);
                    this.removeLoader = false;
                }
            },
            async removeDeviceLink(device_id, task_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('task_id', task_id);
                formData.append('device_id', device_id);
                const response = await this.$axios.$post('/api/tasks/remove-device-task', formData);
                if (response) {
                    const taskResponse = await this.$axios.get(`/api/tasks/${task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', taskResponse);
                    this.removeLoader = false;
                }
            },
            async removeFaceLink(face_id, task_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('task_id', task_id);
                formData.append('face_id', face_id);
                const response = await this.$axios.$post('/api/tasks/remove-face-task', formData);
                if (response) {
                    const taskResponse = await this.$axios.get(`/api/tasks/${task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', taskResponse);
                    this.removeLoader = false;
                }
            },
            async removeFile(file_id, task_id) {
                this.removeLoader = true;
                const formData = new FormData();
                formData.append('photo_id', file_id);
                const response = await this.$axios.$post('/api/media/remove', formData);
                if (response) {
                    const taskResponse = await this.$axios.get(`/api/tasks/${task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', taskResponse);
                    this.removeLoader = false;
                }
            },
            clearFields() {
                this.form.title = "";
                this.form.group_id = 1;
                this.form.type_id = 1;
                this.form.status_id = 1;
                this.form.customer_id = 1;
                this.form.users[0] = this.$auth.user.id;
                this.form.quickly = false;
                this.form.deanon = false;
                this.form.fixed = false;
                this.form.deanon_success_count = "";
                this.form.count = "";
                this.form.deadline_date = "";
                this.form.comment = "";
                this.form.result = "";
                this.form.results = [];
                this.form.files = [];
                this.form.execution_date = "";
                this.form.control = false;
                this.files_files = [];
            },
            getFilterData() {
                const formData = new FormData();
                for (const [key, value] of Object.entries(this.form)) {
                    formData.append(key, value);
                }
                this.form.results.forEach((file) => {
                    formData.append('results[]', file);
                });
                this.form.files.forEach((file) => {
                    formData.append('files[]', file);
                });
                formData.append('user_id', this.user_id);
                formData.append('quickly', this.form.quickly ? 1 : 0);
                formData.append('deanon', this.form.deanon ? 1 : 0);
                formData.append('fixed', this.form.fixed ? 1 : 0);
                formData.append('control', this.form.control ? 1 : 0);
                return formData;
            },
            async close() {
                this.$store.commit('tasks/SET_DIALOG');
                this.$store.commit('tasks/ERROR_OFF');
                this.$store.commit('tasks/ERRORS_STORE', []);
                this.$store.commit('tasks/SUCCESS_STORE', []);
                this.$store.commit('tasks/SET_OPEN_TASK_ID', null);
                this.$store.commit('tasks/STORE_TASK', []);
                this.$store.commit('tasks/STORE_EVENTS', []);
                this.clearFields();
                if (!this.open_task_id) {
                    this.form.incoming_date = toDay();
                    this.changeIncomingDate();
                }
                //
            },
            async save() {
                const formData = this.getFilterData();
                if (this.open_task_id) {
                    formData.append('open_task_id', this.open_task_id);
                    await this.$store.dispatch('tasks/UPDATE_TASK', formData);
                    const taskResponse = await this.$axios.get(`/api/tasks/${this.open_task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', taskResponse);
                    this.form.results = []
                    this.form.files = []
                } else {
                    await this.$store.dispatch('tasks/CREATE_TASK', formData)
                    this.form.results = []
                    this.form.files = []
                    await this.$store.dispatch('tasks/GET_TASKS_FROM_API', [this.filter_data, this.currentUserId, 1]);
                }
            },
            changeQuickly() {
                if (this.form.quickly === true) {
                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate());
                    this.form.deadline_date = endDate.toISOString().split('T')[0];
                } else {
                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 2);
                    this.form.deadline_date = endDate.toISOString().split('T')[0];
                }
            },
            changeIncomingDate() {
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 2);
                this.form.deadline_date = endDate.toISOString().split('T')[0];
            },
        }
    }
</script>

<style>
    .v-textarea .v-text-field__details {
        display: none;
    }

    .quickly label {
        color: red !important;
    }

    .v-alert {
        margin-bottom: 0 !important;
    }

    .v-dialog:not(.v-dialog--fullscreen) {
        max-height: 95%;
    }

    a.help {
        font-size: 12px;
        text-decoration: none;
        border-bottom: 1px dashed;
        margin: 0 5px;
        color: #91a7d9;
    }

    .att_file label {
        font-size: 12px;
    }
    .tilted-paperclip {
        transform: rotate(45deg);
        transform-origin: center;
        margin-right: 5px;
    }
</style>
