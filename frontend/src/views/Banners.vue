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

import { deleteBannerService } from '@/service/admin/banner'; 
async function deleteBanner(bannerId) {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    loaderStore.showLoader = true; 
    try {
        const result = await deleteBannerService(bannerId, userStore.token);
        if (result.code == 1) {
            alert("Banner deleted successfully");
            await fetchBannerListFromDB();
        } else {
            alert("Failed to delete the banner: " + result.message);
        }
    } catch (error) {
        console.error("Error deleting banner:", error);
        alert("An error occurred while trying to delete the banner.");
    } finally {
        loaderStore.showLoader = false; 
    }
}

const editingBannerData = ref({});
const editButtonClicked = ref(false);

function handleEditClick(banner){
  editingBannerData.value = banner
  editButtonClicked.value = true
}


const closeEditBannerDialog = () =>{
  editButtonClicked.value = false
  editingBannerData.value = {}
}

</script>

<template>
  <div>
    <div v-if="editButtonClicked" class="z-[100] w-full h-[100vh] absolute backdrop-blur-sm">
      <div id="default-modal" class="overflow-y-auto overflow-x-hidden flex justify-center">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Banner
              </h3>
              <button @click="closeEditBannerDialog" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4">
              <input type="text" v-model="editingBannerData.title" placeholder="Title" class="w-full p-2 mb-2 border rounded">
              <input type="text" v-model="editingBannerData.banner_image" placeholder="Banner URL" class="w-full p-2 mb-2 border rounded">
              <select v-model="editingBannerData.isactive" class="w-full p-2 mb-2 border rounded">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <input type="text" v-model="editingBannerData.link" placeholder="Link" class="w-full p-2 mb-4 border rounded">
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button @click="updateBanner" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Changes</button>
              <button @click="closeEditBannerDialog" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h3 class="text-2xl font-bold text-left py-2 z-10">Banners Page</h3>
    <div class="overflow-x-auto relative sm:rounded-lg z-10">
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
              <button @click.prevent="handleEditClick(banner)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
            </td>
            <td class="py-4 px-6 text-right">
              <button @click="deleteBanner(banner.banner_id)" class="font-medium text-red-600 hover:text-red-700">Delete</button>
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
</style>
