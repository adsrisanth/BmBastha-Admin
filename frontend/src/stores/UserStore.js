import { defineStore } from "pinia";
import {ref} from 'vue'

export const useUserStore = defineStore('user-store' , ()=>{
    const userId = ref('')
    const role = ref('')
    const token = ref('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEzMTc5NTY4LCJleHAiOjE3MTM3ODQzNjh9._ZgYnWSL81bDjUVXbRoDsDhzZDqURURfZyG8QKHO1vs7eaRNlgMkzoSNnGKyw47usprP6JBSq5OzCXFLyvPGqA')

return{
userId,
role,
token
    }
})