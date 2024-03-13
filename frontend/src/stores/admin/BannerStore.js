import { defineStore } from "pinia";
import {ref} from 'vue'

export const useBannerStore = defineStore('banner-store',()=>{
    const bannerList = ref([]) //Array of objects
    /*
        banner_id, title , banner_image , isactive (1 or 0) , link
    */
   const isAddingItemInProgess = ref(false)
    return {
        bannerList,
        isAddingItemInProgess
    }

})