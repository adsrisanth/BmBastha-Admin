import { defineStore } from "pinia";
import {ref} from 'vue'

export const useUserStore = defineStore('user-store' , ()=>{
    const userId = ref('')
    const role = ref('')
    const token = ref('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMDM1MDM0NCwiZXhwIjoxNzEwOTU1MTQ0fQ.aKnSLPko5nNXmbVK6MG60T4D7KC7HdnIhNXIbNCHBZtJ1K6Q5b0CPLORCWnHWZA5dElddYakgnh3pLijuKOFBA')

    // eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMDM1MDM0NCwiZXhwIjoxNzEwOTU1MTQ0fQ.aKnSLPko5nNXmbVK6MG60T4D7KC7HdnIhNXIbNCHBZtJ1K6Q5b0CPLORCWnHWZA5dElddYakgnh3pLijuKOFBA
    return{
        userId,
        role,
        token
    }
})