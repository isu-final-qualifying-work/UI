<template>
    <div v-if="show" class="modal-shadow" @click.self="closeModal">
        <div class="modal">
            <div class="modal-close" @click="closeModal">&#10006;</div>
            <slot name="title">
                <h3 class="modal-title">Заголовок</h3>
            </slot>
            <slot name="body">
            </slot>
            <slot name="footer">
                <div class="modal-footer">
                    <button class="modal-footer__button" @click="closeModal">
                        Ок
                    </button>
                </div>
            </slot>
        </div>
    </div>
</template>
 
<script>
    export default {
        name: "ModalWindow",
        data: function () {
            return {
                show: false
            }
        },
        methods: {
            closeModal: function () {
                this.show = false
            }
        }
    }
</script>
 
<style scoped>
.modal-shadow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.3s ease-in-out;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
    animation: modalFadeIn 0.3s ease-in-out;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease-in-out;
}

.modal-close:hover {
    color: #333;
}

.modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #333;
}

.modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.modal-footer__button {
    padding: 10px 20px;
    border: none;
    background-color: #42b883;
    color: white;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.modal-footer__button:hover {
    background-color: #369a6e;
}

@keyframes modalFadeIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

</style>