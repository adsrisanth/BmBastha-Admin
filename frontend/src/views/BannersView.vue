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
      }
      loaderStore.showLoader = false
    })
    .catch((err)=>{
      loaderStore.showLoader = false
    })
}

onBeforeMount(async() => {
  await fetchBannerListFromDB()
})

const newItem = ref({
  bannerId: '',
  title:'',
  banner_image:'',
  link: '',
  isactive: true,
})

async function addBanner(){
  if(newItem.value.title.length == 0 || newItem.value.banner_image.length == 0){
    return
  }
  const data = {
    bannerId: newItem.value.bannerId,
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
import { updateBannerService } from '@/service/admin/banner';

async function updateBanner(bannerId, updatedData) {
    if (!confirm("Are you sure you want to update this banner?")) return;

    loaderStore.showLoader = true;
    try {
      if(updatedData.isactive=='true')
        updatedData.isactive=true;
      else
        updatedData.isactive=false
        const result = await updateBannerService(updatedData, userStore.token);
        if (result.code === 1) {
            alert("Banner updated successfully");
            await fetchBannerListFromDB();
        } else {
            alert("Failed to update the banner: " + result.message);
        }
    } catch (error) {
        console.error("Error updating banner:", error);
        alert("An error occurred while trying to update the banner.");
    } finally {
        loaderStore.showLoader = false;
    }
}


</script>

<template>
  <div>
    <div v-if="loaderStore.showLoader" class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div class="loader flex space-x-2">
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
      </div>
    </div>
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
              <input type="text" v-model="editingBannerData.link" placeholder="Link" class="w-full p-2 mb-4 border rounded">
              <select v-model="editingBannerData.active" placeholder="Status" class="w-full p-2 mb-2 border rounded">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button @click="()=>updateBanner(editingBannerData.bannerId , editingBannerData)" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Changes</button>
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
            <td><input v-model="newItem.bannerId" placeholder="Banner ID" class="w-full p-3 text-base border-2 rounded-md"></td>
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
              <div class="flex items-center">Title</div>
            </th>
            <th scope="col" class="py-3 px-6">
              <div class="flex items-center">Banner Image</div>
            </th>
            <th scope="col" class="py-3 px-6">
              <div class="flex items-center">Status</div>
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
              {{ banner.banner_image }}
            </td>
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

<style scoped>
.loader {
  width: 60px;
  display: flex;
  justify-content: space-evenly;
}

.ball {
  list-style: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
}

.ball:nth-child(1) {
  animation: bounce-1 2.1s ease-in-out infinite;
}

@keyframes bounce-1 {
  50% {
    transform: translateY(-18px);
    background-color: green;
  }
}

.ball:nth-child(2) {
  animation: bounce-3 2.1s ease-in-out 0.3s infinite;
}

@keyframes bounce-2 {
  50% {
    transform: translateY(-18px);
    background-color: green;
  }
}

.ball:nth-child(3) {
  animation: bounce-3 2.1s ease-in-out 0.6s infinite;
}

@keyframes bounce-3 {
  50% {
    transform: translateY(-18px);
    background-color: green;
  }
}
</style>
