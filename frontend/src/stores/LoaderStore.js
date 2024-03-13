import { defineStore } from "pinia";

import {ref} from 'vue'

export const useLoaderStore = defineStore('loader-store' , ()=>{

    const showLoader = ref(false)
    
    function toggleLoader(){
        showLoader.value = !showLoader
    }

    return{
        showLoader,
        toggleLoader
    }

})