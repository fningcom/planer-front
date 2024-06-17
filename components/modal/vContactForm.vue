<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="560px"
        >
            <v-card
                    v-if="edit_contact_loading"
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
                        Новый контакт
                    </v-tab>
                    <v-tab href="#tab-1" v-else>
                        <v-icon small>mdi-pencil</v-icon>
                        <span style="width: 10px"></span>ID#{{ contact.id }}
                    </v-tab>
                    <v-tab href="#tab-2">
                        Комментарий
                    </v-tab>
                    <v-tab href="#tab-3" v-if="!multi_insert">
                        Скриншоты
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
                                    <v-row v-if="!form_editing">
                                        <v-col>
                                            <v-switch
                                                    v-model="multi_insert"
                                                    label="Массовый импорт"
                                                    color="success"
                                                    value="success"
                                                    hide-details
                                            ></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <div class="icons mb-3">
                                                <v-img src="/img/icons/phone.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(11)"></v-img>
                                                <v-img src="/img/icons/mail.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(15)"></v-img>
                                                <v-img src="/img/icons/telegram.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(6)"></v-img>
                                                <v-img src="/img/icons/viber.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(2)"></v-img>
                                                <v-img src="/img/icons/skype.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(13)"></v-img>
                                                <v-img src="/img/icons/ok.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(3)"></v-img>
                                                <v-img src="/img/icons/instagram.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(19)"></v-img>
                                                <v-img src="/img/icons/vk.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(4)"></v-img>
                                                <v-img src="/img/icons/fb.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(5)"></v-img>
                                                <v-img src="/img/icons/youtube.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(17)"></v-img>
                                                <v-img src="/img/icons/twitter.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(16)"></v-img>
                                                <v-img src="/img/icons/my.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(18)"></v-img>
                                                <v-img src="/img/icons/tiktok.png" max-width="24" class="v-icon-a"
                                                       @click="selectIcon(14)"></v-img>
                                            </div>
                                            <v-row >
                                                <v-col col="6" md="6">
                                                    <v-autocomplete
                                                            v-model="form.type_id"
                                                            :items="contact_types"
                                                            item-value="id"
                                                            item-text="type"
                                                            label="Тип контакта *"
                                                            :error-messages="error ? errors.data.type_id: ''"
                                                    ></v-autocomplete>
                                                </v-col>
                                                <v-col col="6" md="6"
                                                        v-if="form.type_id !== 1 && !multi_insert && selectType">
                                                    <v-text-field
                                                            :label="hint"
                                                            required
                                                            v-model="form.code"
                                                            :error-messages="error ? errors.data.code: ''"
                                                            :loading="loading"
                                                            hint="Для проверки по базе, жми Enter"
                                                            @change="onInput"

                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>

                                        </v-col>
                                    </v-row>


                                    <div v-if="contact_found && !multi_insert" class="scrollable-container mt-3">
                                        <v-row v-for="item in contact_found"
                                               :key="item.id"
                                               class="mb-5"
                                        >
                                            <v-col cols="1" md="1" style="display: flex; align-items: center;">
                                                <v-img :src="item.type.icon" min-width="24"/>
                                            </v-col>
                                            <v-col cols="8" md="8">
                                                <v-text-field
                                                        v-if="item.type"
                                                        :value="item.code"
                                                        :label="item.type.type"
                                                        :hint="getFormattedHint(item)"
                                                        persistent-hint
                                                        disabled
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="3" md="3" style="display: flex; align-items: center;">
                                                <v-btn
                                                        color="blue darken-1"
                                                        outlined
                                                        small
                                                        dense
                                                        @click="bindContact(item.id)"
                                                >
                                                    Привязать
                                                </v-btn>
                                            </v-col>
                                        </v-row>

                                    </div>
                                    <v-row v-if="!multi_insert && contact_found.length === 0 && selectType">
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    label="ФИО / Имя / Подписан"
                                                    required
                                                    v-model="form.name"
                                                    :error-messages="error ? errors.data.name: ''"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6" md="6">
                                            <v-text-field
                                                    type="date"
                                                    label="Дата рождения"
                                                    required
                                                    v-model="form.birthday"
                                                    :error-messages="error ? errors.data.birthday   : ''"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="!multi_insert && selectType">
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                    label="Должность"
                                                    required
                                                    v-model="form.job"
                                                    :error-messages="error ? errors.data.job: ''"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-file-input
                                                    accept="image/png, image/jpeg, image/bmp"
                                                    placeholder="Выберите файл"
                                                    prepend-icon="mdi-camera"
                                                    label="Фото профиля"
                                                    v-model="form.image"
                                                    @change="onFileChange"
                                                    @click:clear="onFileClear"
                                            ></v-file-input>
                                        </v-col>
                                    </v-row>
                                    <div style="width: 230px; margin: 0 auto; position: relative"
                                         v-if="avatar && avatar.length >0 &&!multi_insert && viewImage">
                                        <image-preview
                                                :previewUrl="avatar[0]['preview_url']"
                                                :fullImageUrl="avatar[0]['original_url']"
                                        />
                                        <v-icon class="close-btn" @click="removePhoto(avatar[0]['id'])">mdi mdi-close
                                        </v-icon>
                                    </div>


                                    <v-row v-if="multi_insert && selectType">
                                        <v-col cols="12" md="12">
                                            <v-textarea
                                                    v-model="form.import"
                                                    outlined
                                                    name="input-7-4"
                                                    :label="hint"
                                                    dense
                                                    hint="Каждая ссылка / номер телефона с новой строки"
                                                    :error-messages="error ? errors.data.codes   : ''"
                                            ></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-2" v-if="selectType">
                        <v-card flat>
                            <v-card-text>
                                <v-row v-if="!multi_insert && contact_found.length === 0 && selectType">
                                    <v-col>
                                        <v-textarea
                                                v-model="form.comment"
                                                outlined
                                                name="input-7-4"
                                                label="Коментарий"
                                                height="300"
                                                dense
                                        ></v-textarea>

                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-3" v-if="selectType">
                        <v-card flat>
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-file-input
                                                accept="image/png, image/jpeg, image/bmp"
                                                placeholder="Выберите файл"
                                                prepend-icon="mdi-camera"
                                                label="Скриншоты"
                                                v-model="form.screenshots"
                                                multiple
                                        ></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-if="screenshots_src && screenshots_src.length > 0"
                                           v-for="item in screenshots_src"
                                           :key="item.id"
                                    >
                                        <div style="width: 230px; margin: 0 auto; position: relative"
                                             v-if="item && item.original_url">
                                            <image-preview
                                                    :previewUrl="item.preview_url"
                                                    :fullImageUrl="item.original_url"
                                            />
                                            <v-icon class="close-btn" @click="removePhoto(item.id)">mdi mdi-close
                                            </v-icon>
                                        </div>
                                    </v-col>
                                </v-row>
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
    import {filterMediaByCollection, formatDate} from '../../plugins/helpers.js'
    import ImagePreview from "../imagePreview";

    export default {
        name: "vContactForm",
        components: {ImagePreview},
        data() {
            return {
                tab: null,
                hint: "",
                multi_insert: false,
                imageUrl: "",
                loading: false,
                selectType: false,
                viewImage: false,
                form_editing: false,
                original_url: "",
                preview_url: "",
                avatar: [],
                screenshots_src: [],
                // форма
                form: {
                    type_id: "",
                    code: "",
                    image: null,
                    screenshots: [],
                    import: "",
                    comment: "",
                    name: "",
                    birthday: "",
                    job: ""
                }
            }
        },
        mounted() {
            this.tab = 1
        },
        computed: {
            ...mapState('contacts', ['contact', 'errors', 'success', 'form_loading', 'error', 'contact_found', 'edit_contact_loading']),
            ...mapState('layout', ['contact_types']),
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
            contact(value) {
                if (value) {
                    this.multi_insert = false
                    this.form_editing = true
                    this.form.type_id = value.type_id
                    this.form.code = value.code
                    this.form.name = value.name
                    this.form.birthday = value.birthday
                    this.form.image = value.image
                    this.form.job = value.job
                    if (value.image_url) {
                        this.viewImage = true
                        this.imageUrl = value.image_url
                    }
                    if (value.media && value.media.length > 0) {
                        this.viewImage = true;
                        this.avatar = filterMediaByCollection(value.media, 'avatar');
                        this.screenshots_src = filterMediaByCollection(value.media, 'screenshots');
                    }
                    this.form.comment = value.comment
                }
            }
        },
        methods: {
            getFormattedHint(item) {
                let hint = '';
                if (item.name) {
                    hint += item.name;
                }
                if (item.birthday) {
                    if (hint) {
                        hint += ', ';
                    }
                    hint += formatDate(item.birthday);
                    hint += ' г.р.'
                }
                return hint;
            },

            async onInput() {
                if (this.form.code.length !== 0) {
                    this.loading = true;
                    const params = {
                        code: this.form.code,
                        type_id: this.form.type_id,
                    };
                    const response = await this.$axios.$get('/api/contacts/code/', {params});
                    if (response && response.success && response.success === true) {
                        this.loading = false;
                        this.$store.commit('contacts/SET_CONTACT_FOUND', response.contact);
                    } else {
                        this.loading = false;
                        this.$store.commit('contacts/SET_CONTACT_FOUND', []);
                    }
                }
            },
            createImage(file) {
                const reader = new FileReader();
                reader.onload = e => {
                    this.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
                this.viewImage = true
            },
            onFileChange(file) {
                if (!file) {
                    return;
                }
                this.createImage(file);
            },
            onFileClear() {
                this.viewImage = false
            },
            async removePhoto(photo_id) {
                const formData = new FormData();
                formData.append('photo_id', photo_id);
                try {
                    this.screenshots_src = this.screenshots_src.filter(item => item.id !== photo_id);
                    this.avatar = this.avatar.filter(item => item.id !== photo_id);
                    const response = await this.$axios.$post('/api/media/remove', formData);
                } catch (error) {
                    console.error('Error removing photo:', error);
                }
            },
            openModal(img) {
                this.$store.commit('layout/LOAD_MODAL_IMG', img);
                this.$store.commit('layout/SET_IMG_DIALOG');
            },
            clearFields() {
                // this.form.type_id = "";
                this.form.code = "";
                this.form.name = "";
                this.form.birthday = "";
                this.form.job = "";
                this.form.image = null;
                this.form.comment = "";
                this.form.import = "";
                this.screenshots_src = [];
                this.tab = 1;
                this.onFileClear()
            },
            findContactTypeById(contact_types, id) {
                return contact_types.find(contact_type => contact_type.id === id);
            },
            selectIcon(id) {
                if (id === 11 || id === 2) {
                    this.form.code = '+373'
                }
                this.form.type_id = id
                const contactType = this.findContactTypeById(this.contact_types, id);
                this.hint = contactType['code']
            },
            async close() {
                this.form_editing = false
                this.$store.commit('contacts/SET_DIALOG');
                this.$store.commit('contacts/ERROR_OFF');
                this.$store.commit('contacts/ERRORS_STORE', []);
                this.$store.commit('contacts/SUCCESS_STORE', []);
                this.$store.commit('contacts/SET_CONTACT_FOUND', []);
                this.$store.commit('contacts/STORE_CONTACT', []);
                this.clearFields()
                this.tab = 1
            },
            async save() {
                const formData = new FormData();
                if (this.open_document_id) {
                    formData.append('document_id', this.open_document_id);
                }
                if (this.open_task_id) {
                    formData.append('task_id', this.open_task_id);
                }
                formData.append('user_id', this.user_id);

                // Если массовая загрузка контактов
                if (this.multi_insert) {
                    const lines = this.form.import.split('\n'); // Разбить текст по строкам
                    formData.append('codes', JSON.stringify(lines)); // Сериализовать массив в JSON и добавить в FormData
                    formData.append('type_id', this.form.type_id);
                    formData.append('comment', this.form.comment);
                    await this.$store.dispatch('contacts/IMPORT_CONTACTS', formData);
                } else {
                    for (const [key, value] of Object.entries(this.form)) {
                        formData.append(key, value);
                    }
                    this.form.screenshots.forEach((file, index) => {
                        formData.append(`screenshots[${index}]`, file);
                    });
                    if (this.form_editing) {
                        await this.$store.dispatch('contacts/UPDATE_CONTACT', formData);
                    } else {
                        await this.$store.dispatch('contacts/CREATE_CONTACT', formData);
                    }
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
            async bindContact(contact_id) {
                const formData = new FormData();
                if (this.open_document_id) {
                    formData.append('document_id', this.open_document_id);
                }
                if (this.open_task_id) {
                    formData.append('task_id', this.open_task_id);
                }
                formData.append('contact_id', contact_id);
                await this.$store.dispatch('contacts/BIND_CONTACT', formData);
                if(this.open_document_id){
                    const documentResponse = await this.$axios.get(`/api/documents/${this.open_document_id}/edit`);
                    this.$store.commit('documents/STORE_DOCUMENT', documentResponse);
                }
                if(this.open_task_id){
                    const documentResponse = await this.$axios.get(`/api/tasks/${this.open_task_id}/edit`);
                    this.$store.commit('tasks/STORE_TASK', documentResponse);
                }
                this.$store.commit('contacts/SET_CONTACT_FOUND', []);
                this.clearFields();
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
            }
        },
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

    .close-btn {
        cursor: pointer !important;
        position: absolute !important;
        top: -5px;
        right: -5px;
        background: #ff6767;
        color: #fff !important;
    }
</style>
