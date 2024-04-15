import { defineStore } from "pinia";
import { ref } from 'vue';

export const useCategoriesStore = defineStore('Categories-store', () => {
    const CategoriesList = ref([]); // Array of objects
    /*
        id, title, description, imageurl.
    */
    const isAddingItemInProgress = ref(false);

    return {
        CategoriesList,
        isAddingItemInProgress
    };
});
