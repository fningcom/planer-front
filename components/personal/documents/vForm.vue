<template>
    <v-row justify="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
        >

            <v-card>
                <v-card-title>
                    <span class="text-h5">Новый документ</span>
                </v-card-title>
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
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="blue darken-1"
                            text
                            @click="close()"
                    >
                        Close
                    </v-btn>
                    <v-btn
                            color="success"
co                            text
                            @click="save()"
                    >
                        Save
                    </v-btn>

                </v-card-actions>

            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    export default {
        name: "vForm",
        data() {
            return {
                error: false,
                errors: '',
                success: ''
            }
        },
        props: ['dialog'],
        methods: {
            async close() {
                this.dialog = false;
            },
            async save() {
                this.dialog = false;
            },
        }
    }
</script>

<style scoped>

</style>
