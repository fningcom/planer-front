<template>
    <div>
        <img
                :src="previewUrl"
                @click="showLightbox = true"
                style="cursor: pointer; max-width: 230px;"
                alt="Preview"
        />
        <div v-if="showLightbox" class="lightbox" @click="showLightbox = false">
            <div class="lightbox-content" @click.stop>
                <span class="close" @click="showLightbox = false">&times;</span>
                <img :src="fullImageUrl" class="lightbox-image" alt="Full Image" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "imagePreview",
        props: {
            previewUrl: {
                type: String,
                required: true,
            },
            fullImageUrl: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                showLightbox: false,
            };
        },
    }
</script>

<style scoped>
    /* Стили для модального окна */
    .lightbox {
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox-image {
        width: 100%;
        height: auto;
    }

    .close {
        position: absolute;
        top: -10px;
        right: -30px;
        color: white;
        font-size: 35px;
        font-weight: bold;
        cursor: pointer;
    }
</style>
