<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="620px"
                @open="focusCard"
        >
            <v-card tile>
                <v-toolbar
                        color="blue darken-1"
                        dark
                        dense
                >
                    Загрузка медиа
                    <v-spacer></v-spacer>
                    <v-btn
                            icon
                            dark
                            @click="close"
                            right
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <div style="padding: 20px;">
                        <drag-drop v-model="image" style="height: 340px" ref="card"/>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>

<!--                    <v-btn-->
<!--                            color="blue darken-1"-->
<!--                            text-->
<!--                            @click="close()"-->
<!--                    >-->
<!--                        Закрыть-->
<!--                    </v-btn>-->
                    <v-btn
                            color="success"
                            co text
                            @click="save()"
                            v-if="image"
                    >
                        Загрузить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import DragDrop from "../DragDrop";

    export default {
        name: "UploadForm",
        data() {
            return {
                image: null,
            }
        },
        components: {DragDrop},
        props: ['dialog'],
        methods: {
            close() {
                this.image = null;
                this.$store.commit('layout/UPLOAD_FORM_TRIGGER');
            },
            focusCard() {
                this.$nextTick(() => {
                    if (this.$refs.card) {
                        this.$refs.card.focus();
                    }
                });
            },
            save() {
                if (this.image instanceof File) {
                    this.$emit('uploadImage', {
                        image: this.image,
                    });
                    this.image = null;
                } else {
                    console.error('Uploaded file is not valid');
                }
            },

        }
    }
</script>

<style scoped>

</style>
