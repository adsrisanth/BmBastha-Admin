<script setup>

import { useBannerStore } from '@/stores/admin/BannerStore';
import { ref , onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/UserStore';
import { fetchBannerList , addBannerService } from '@/service/admin/banner';
import { useLoaderStore } from '@/stores/LoaderStore';

const loaderStore = useLoaderStore()
const bannerStore = useBannerStore()
const userStore = useUserStore()

async function fetchBannerListFromDB(){
  loaderStore.showLoader = true
  await fetchBannerList(userStore.token)
    .then((result)=>{
      if(result.code == 1){
        console.log(result)
        bannerStore.bannerList = result.data
        loaderStore.showLoader = false
      }
      else{
        alert(result.message)
        loaderStore.showLoader = false
        // Redirect here if needed
      }
      loaderStore.showLoader = false
    })
    .catch((err)=>{
      //Show toast need "Something went wrong"
      loaderStore.showLoader = false
    })
}

onBeforeMount(async() => {
  await fetchBannerListFromDB()
})

const newItem = ref({
  title:'',
  banner_image:'',
  isactive: true,
  link: ''
})

async function addBanner(){
  if(newItem.value.title.length == 0 || newItem.value.banner_image.length == 0){
    return
  }
  const data = {
    title: newItem.value.title,
    banner_image: newItem.value.banner_image,
    isactive: newItem.value.isactive,
    link: newItem.value.link
  }
  bannerStore.isAddingItemInProgess = true
  await addBannerService(data , userStore.token)
    .then((result)=>{
      if(result.code == 1){
        bannerStore.bannerList.push(data)
        alert(result.message || 'Success')

      }
      else
        alert(result.message)
    })
    bannerStore.isAddingItemInProgess = false
}

</script>

<template>
  <div>
    <h3 class="text-2xl font-bold text-left py-2">Banners Page</h3>
    <div class="overflow-x-auto relative sm:rounded-lg">
      <table class="w-full text-[16px] text-left text-gray-700 dark:text-gray-400">
        <tbody>
          <tr>
            <td><input v-model="newItem.title" placeholder="Title" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.banner_image" placeholder="Banner Url" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.isactive" placeholder="Status" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.link" placeholder="Link" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><button :disabled="bannerStore.isAddingItemInProgess" @click="addBanner" class="px-4 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 transition-colors mx-9 my-2">{{ bannerStore.isAddingItemInProgess ? 'Adding ...' : 'Add' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="overflow-x-auto relative sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <div>
    <div class="overflow-x-auto relative  sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">
              Banner ID
            </th>
            <th scope="col" class="py-3 px-6">
              <div class="flex items-center">
                Title
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" class="ml-1 w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"></path>
                  </svg></a>
              </div>
            </th>
            <th scope="col" class="py-3 px-6">
              <div class="flex items-center">
                Status
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" class="ml-1 w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"></path>
                  </svg></a>
              </div>
            </th>
            <th scope="col" class="py-3 px-6">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in bannerStore.bannerList" :key="banner.banner_id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ banner.banner_id }}
            </th>
            <td class="py-4 px-6">
              {{ banner.title }}
            </td>
            <td class="py-4 px-6">
              {{ banner.isactive==1?'Active':'In-active' }}
            </td>
            <td class="py-4 px-6 text-right">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
      </table>
    </div>
  </div>
</template>

<style>
/* Add your styles here if needed */
</style>
