<template>
    <div
            class="drag-drop-area"
            @click="openFileDialog"
            @dragover.prevent="onDragOver"
            @drop.prevent="onDrop"
            @paste="onPaste"
    >
        <p>Перетащите сюда изображение, вставьте из буфера обмена или нажмите для выбора файла</p>
        <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="onFileChange"
                style="display: none;"
        />
        <div v-if="previewUrl" class="preview-container">
            <img :src="previewUrl" alt="Preview" class="preview-image"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                default: null
            }
        },
        data() {
            return {
                previewUrl: null // Состояние для хранения URL предпросмотра
            };
        },
        methods: {
            onDragOver(event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
            },
            onDrop(event) {
                event.preventDefault();
                const files = event.dataTransfer.files;
                if (files.length) {
                    this.handleFile(files[0]);
                }
            },
            onFileChange(event) {
                const file = event.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
            },
            onPaste(event) {
                const items = event.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            this.handleFile(file);
                        }
                    }
                }
            },
            handleFile(file) {
                this.previewUrl = URL.createObjectURL(file); // Создаем URL для предпросмотра
                this.$emit('input', file); // Эмитируем событие input с выбранным файлом
            },
            openFileDialog() {
                this.$refs.fileInput.click();
            }
        },
        watch: {
            value(newFile) {
                if (newFile) {
                    this.previewUrl = URL.createObjectURL(newFile);
                } else {
                    this.previewUrl = null;
                }
            }
        }
    };
</script>

<style scoped>
    .drag-drop-area {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .preview-container {
        margin-top: 20px;
    }

    .preview-image {
        max-width: 100%;
        max-height: 200px;
    }
</style>
