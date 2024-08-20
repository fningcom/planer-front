<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="560px"
        >
            <v-card
                    v-if="edit_face_loading"
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
                        Новое лицо
                    </v-tab>
                    <v-tab href="#tab-1" v-else>
                        <v-icon small>mdi-pencil</v-icon> <span style="width: 10px"></span>ID#{{ face.id }}
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
                                        <v-col cols="4" md="4">
                                            <v-text-field
                                                    label="Фамилия *"
                                                    required
                                                    v-model="form.surname"
                                                    :error-messages="error ? errors.data.surname: ''"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="4" md="4">
                                            <v-text-field
                                                    label="Имя *"
                                                    required
                                                    v-model="form.name"
                                                    :error-messages="error ? errors.data.name: ''"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="4" md="4">
                                            <v-text-field
                                                    label="Отчество"
                                                    required
                                                    v-model="form.parent_name"
                                                    :error-messages="error ? errors.data.parent_name: ''"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6" md="6">
                                            <v-autocomplete
                                                    v-model="form.sex"
                                                    :items="sex"
                                                    item-value="id"
                                                    item-text="title"
                                                    label="Пол"
                                                    :error-messages="error ? errors.data.sex: ''"
                                            ></v-autocomplete>
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
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                    label="Адрес"
                                                    required
                                                    v-model="form.address"
                                                    :error-messages="error ? errors.data.address   : ''"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <p>Фото профиля</p>
                                    <div style="width: 230px; margin: 0 auto; position: relative; margin-top: 10px"
                                         v-if="avatar && avatar.length > 0 &&!multi_insert && viewImage">
                                        <image-preview
                                                :previewUrl="avatar[0]['preview_url']"
                                                :fullImageUrl="avatar[0]['original_url']"
                                        />
                                        <v-icon class="close-btn" @click="removePhoto(avatar[0]['id'])">mdi mdi-close
                                        </v-icon>
                                    </div>
                                    <drag-drop v-model="form.image" v-if="!viewImage"/>

<!--                                        <v-row>-->
<!--                                            <v-col cols="12" md="12">-->
<!--                                                <v-file-input-->
<!--                                                        accept="image/png, image/jpeg, image/bmp"-->
<!--                                                        placeholder="Выберите файл"-->
<!--                                                        prepend-icon="mdi-camera"-->
<!--                                                        label="Фото профиля"-->
<!--                                                        v-model="form.image"-->
<!--                                                        @change="onFileChange"-->
<!--                                                        @click:clear="onFileClear"-->
<!--                                                ></v-file-input>-->
<!--                                            </v-col>-->
<!--                                        </v-row>-->
<!--                                        <div style="width: 230px; margin: 0 auto; position: relative"-->
<!--                                             v-if="imageUrl && !avatar &&!multi_insert && viewImage">-->
<!--                                            <image-preview-->
<!--                                                    :previewUrl="imageUrl"-->
<!--                                                    :fullImageUrl="imageUrl"-->
<!--                                            />-->
<!--                                        </div>-->
<!--                                        <div style="width: 230px; margin: 0 auto; position: relative"-->
<!--                                             v-if="avatar && avatar.length > 0 &&!multi_insert && viewImage">-->
<!--                                            <image-preview-->
<!--                                                    :previewUrl="avatar[0]['preview_url']"-->
<!--                                                    :fullImageUrl="avatar[0]['original_url']"-->
<!--                                            />-->
<!--                                            <v-icon class="close-btn" @click="removePhoto(avatar[0]['id'])">mdi mdi-close-->
<!--                                            </v-icon>-->
<!--                                        </div>-->
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
            </div>
        </v-dialog>
    </v-row>
</template>

<script>
    import {mapState} from 'vuex'
    import ImagePreview from "../imagePreview";
    import {filterMediaByCollection} from '../../plugins/helpers.js'
    import DragDrop from "../DragDrop";

    export default {
        name: "FaceForm",
        components: {DragDrop, ImagePreview},
        data() {
            return {
                tab: null,
                form_editing: false,
                sex: [
                    {'id':'m', 'title': 'мужской' },
                    {'id':'f', 'title': 'женский'},
                    {'id':'none', 'title': 'не известен'}
                ],
                viewImage: false,
                imageUrl: "",
                avatar: [],
                form: {
                    surname: "",
                    name: "",
                    parent_name:"",
                    full_name: "",
                    birthday: "",
                    address: "",
                    sex: 'none',
                    image: null
                }
            }
        },
        computed: {
            ...mapState('faces', ['face','errors', 'success', 'form_loading', 'error', 'edit_face_loading', 'face_relation', 'face_relation_contact_id']),
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
            full_name() {
             return this.form.surname + " " + this.form.name + " " + this.form.parent_name
            }
        },
        props: ['dialog'],
        watch: {
            face(value) {
                if (value) {
                    this.form_editing = true
                    this.form.surname = value.surname
                    this.form.name = value.name
                    this.form.parent_name = value.parent_name
                    this.form.sex = value.sex
                    this.form.birthday = value.birthday
                    this.form.address = value.address
                    this.form.image = value.image
                    if (value.media && value.media.length > 0) {
                        this.viewImage = true;
                        this.avatar = filterMediaByCollection(value.media, 'avatar');
                    }
                }
            }
        },
        methods: {
            clearFields() {
                this.form.surname = "";
                this.form.name = "";
                this.form.parent_name = "";
                this.form.full_name = "";
                this.form.birthday = "";
                this.form.address = "";
                this.form.image = null;
                this.form.sex = 'none'
                this.onFileClear()
            },
            async save() {
                this.form.full_name = this.full_name;
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
                    await this.$store.dispatch('faces/UPDATE_FACE', formData)
                    if(this.face_relation) {
                        await this.$store.dispatch('contacts/GET_CONTACT_FROM_API', this.face_relation_contact_id)
                    }
                }else{
                    // Привязываем к контакту если есть такая необходимость
                    if(this.face_relation){
                        formData.append('relation', true);
                        formData.append('contact_id', this.face_relation_contact_id);
                    }
                    await this.$store.dispatch('faces/CREATE_FACE', formData)
                    if(this.face_relation) {
                        await this.$store.dispatch('contacts/GET_CONTACT_FROM_API', this.face_relation_contact_id)
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
            async close() {
                this.form_editing = false
                this.$store.commit('faces/SET_FACE_DIALOG');
                this.$store.commit('faces/ERROR_OFF');
                this.$store.commit('faces/ERRORS_STORE', []);
                this.$store.commit('faces/SUCCESS_STORE', []);
                this.$store.commit('faces/SET_FACE_RELATION_OFF');
                this.clearFields()
            },
            async removePhoto(photo_id) {
                const formData = new FormData();
                formData.append('photo_id', photo_id);
                try {
                    this.avatar = this.avatar.filter(item => item.id !== photo_id);
                    const response = await this.$axios.$post('/api/media/remove', formData);
                    this.viewImage = false
                } catch (error) {
                    console.error('Error removing photo:', error);
                }
            },
            createImage(file) {
                this.avatar = null;
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
