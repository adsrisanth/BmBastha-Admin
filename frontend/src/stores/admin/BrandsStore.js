import { defineStore } from "pinia";
import { ref } from 'vue';

export const useBrandStore = defineStore('brand-store', () => {
    const brandList = ref([]); // Array of objects
    /*
        brandId, name, description, imageUrl, tagIds (array of tag IDs)
    */
    const isAddingItemInProgress = ref(false);

    return {
        brandList,
        isAddingItemInProgress
    };
});
