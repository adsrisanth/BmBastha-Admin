import { defineStore } from "pinia";
import { ref } from 'vue';

export const useProductStore = defineStore('product-store', () => {
    const productList = ref([]); // Array of objects
    /*
        id, title, description, price, quantity, imageUrl, tags, etc.
    */
    const isAddingItemInProgress = ref(false);

    return {
        productList,
        isAddingItemInProgress
    };
});
