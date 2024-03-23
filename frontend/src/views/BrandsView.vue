<script setup>
  import { useBrandStore } from '@/stores/admin/BrandsStore';
  import { ref , onBeforeMount } from 'vue'
  import { useUserStore } from '@/stores/UserStore';
  import { fetchBrandList , addBrandService } from '@/service/admin/brands';
  import { useLoaderStore } from '@/stores/LoaderStore';

  const loaderStore = useLoaderStore()
  const brandStore = useBrandStore()
  const userStore = useUserStore()

  async function fetchBrands(){
    loaderStore.showLoader = true
    await fetchBrandList(userStore.token)
      .then((result)=>{
        if(result.code == 1){
          console.log(result)
          brandStore.brandList = result.data
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
    await fetchBrands()
  })

  const newItem = ref({
    brandId: '',
    name:'',
    description:'',
    imageUrl: '',
    tagIds: []
  })

  const fetchTopTags = async () => {
    try {
      const response = await fetch('your_api_url_here');
      const data = await response.json();
      brandStore.topTags = data;
    } catch (error) {
      console.error('Error fetching top tags:', error);
    }
  }

  fetchTopTags();

  async function addBrand(){
    if(newItem.value.name.length == 0 || newItem.value.imageUrl.length == 0){
      return
    }
    const data = {
      brandId: newItem.value.brandId,
      name: newItem.value.name,
      description: newItem.value.description,
      imageUrl: newItem.value.imageUrl,
      tagIds: newItem.value.tagIds,
    }
    brandStore.isAddingItemInProgress = true
    await addBrandService(data , userStore.token)
      .then((result)=>{
        if(result.code == 1){
          brandStore.brandList.push(data)
          alert(result.message || 'Success')
        }
        else
          alert(result.message)
      })
      brandStore.isAddingItemInProgress = false
  }
  const refreshPage = () => {
  location.reload();
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
    <button @click="refreshPage" class="button">
      <span class="button__text">Brands Page</span>
      <span class="button__icon"><svg class="svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path><path d="M0 0h48v48h-48z" fill="none"></path></svg></span>
    </button>
    <div class="overflow-x-auto relative sm:rounded-lg z-10">
      <table class="w-full text-[16px] text-left text-gray-700 dark:text-gray-400">
        <tbody>
          <tr>
            <td><input v-model="newItem.brandId" placeholder="Brand ID" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.name" placeholder="Name" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.description" placeholder="Description" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.imageUrl" placeholder="Image URL" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td>
              <select v-model="newItem.tagIds" multiple class="w-full p-3 text-base border-2 rounded-md">
                <option v-for="tag in brandStore.topTags" :key="tag.tag_id" :value="tag.tag_id">{{ tag.tag_name }}</option>
              </select>
            </td>
            <td><button :disabled="brandStore.isAddingItemInProgress" @click="addBrand" class="px-4 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 transition-colors mx-9 my-2">{{ brandStore.isAddingItemInProgress ? 'Adding ...' : 'Add' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Brands Table -->
    <div class="overflow-x-auto relative sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Brand ID</th>
            <th scope="col" class="py-3 px-6">Name</th>
            <th scope="col" class="py-3 px-6">Description</th>
            <th scope="col" class="py-3 px-6">Image URL</th>
            <th scope="col" class="py-3 px-6">Tags</th>
            <th scope="col" class="py-3 px-6"><span class="sr-only">Edit</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brandStore.brandList" :key="brand.brandId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ brand.brandId }}</th>
            <td class="py-4 px-6">{{ brand.name }}</td>
            <td class="py-4 px-6">{{ brand.description }}</td>
            <td class="py-4 px-6">{{ brand.imageUrl }}</td>
            <td class="py-4 px-6">
              <!-- Display tags -->
              <span v-for="tagId in brand.tagIds" :key="tagId">{{ getTagName(tagId) }}, </span>
            </td>
            <td class="py-4 px-6 text-right">
              <!-- Edit and delete buttons go here -->
            </td>
          </tr>
        </tbody>
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
.button {
  --main-focus: #2d8cf0;
  --font-color:  #14532d;
  --bg-color-sub: #ffffff;
  --bg-color: #ffffff;
  --main-color:  #14532d;
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  overflow: hidden;
}

.button, .button__icon, .button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(8px);
  color: var(--font-color);
  font-weight: 800;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 39px;
  background-color: var(--bg-color-sub);
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 20px;
  fill: var(--main-color);
}

.button:hover {
  background: var(--bg-color);
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 148px;
  transform: translateX(0);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px var(--main-color);
}
</style>