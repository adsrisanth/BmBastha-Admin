<script setup>

  import { useProductStore } from '@/stores/admin/ProductStore';
  import { ref , onBeforeMount } from 'vue'
  import { useUserStore } from '@/stores/UserStore';
  import { fetchProductList , addProductService } from '@/service/admin/products';
  import { useLoaderStore } from '@/stores/LoaderStore';

  const loaderStore = useLoaderStore()
  const productStore = useProductStore()
  const userStore = useUserStore()

  async function fetchProducts(){
    loaderStore.showLoader = true
    await fetchProductList(userStore.token)
      .then((result)=>{
        if(result.code == 1){
          console.log(result)
          productStore.productList = result.data
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
    await fetchProducts()
  })

  const newItem = ref({
    productId: '',
    title:'',
    description:'',
    price: 0,
    quantity: 0,
    imageUrl: '',
    tags: '',
  })

  async function addProduct(){
    if(newItem.value.title.length == 0 || newItem.value.imageUrl.length == 0){
      return
    }
    const data = {
      productId: newItem.value.productId,
      title: newItem.value.title,
      description: newItem.value.description,
      price: newItem.value.price,
      quantity: newItem.value.quantity,
      imageUrl: newItem.value.imageUrl,
      tags: newItem.value.tags,
    }
    productStore.isAddingItemInProgress = true
    await addProductService(data , userStore.token)
      .then((result)=>{
        if(result.code == 1){
          productStore.productList.push(data)
          alert(result.message || 'Success')
        }
        else
          alert(result.message)
      })
      productStore.isAddingItemInProgress = false
  }
  const refreshPage = () => {
  location.reload();
  }

</script>

<template>
  <div>
    <!-- Loader -->
    <div v-if="loaderStore.showLoader" class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div class="loader flex space-x-2">
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
        <div class="ball w-6 h-6 rounded-full bg-white"></div>
      </div>
    </div>

    <!-- Add Product Form -->
    <button @click="refreshPage" class="button">
      <span class="button__text">Products Page</span>
      <span class="button__icon"><svg class="svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path><path d="M0 0h48v48h-48z" fill="none"></path></svg></span>
    </button> 
    <br>   
    <div class="overflow-x-auto relative sm:rounded-lg z-10">
      <table class="w-full text-[16px] text-left text-gray-700 dark:text-gray-400">
        <tbody>
          <tr>
            <td><input v-model="newItem.productId" placeholder="Product ID" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.title" placeholder="Title" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.description" placeholder="Description" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.price" placeholder="Price" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.quantity" placeholder="Quantity" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.imageUrl" placeholder="Image URL" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.tags" placeholder="Tags" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><button :disabled="productStore.isAddingItemInProgress" @click="addProduct" class="px-4 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 transition-colors mx-9 my-2">{{ productStore.isAddingItemInProgress ? 'Adding ...' : 'Add' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto relative sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Product ID</th>
            <th scope="col" class="py-3 px-6">Title</th>
            <th scope="col" class="py-3 px-6">Description</th>
            <th scope="col" class="py-3 px-6">Price</th>
            <th scope="col" class="py-3 px-6">Quantity</th>
            <th scope="col" class="py-3 px-6">Image URL</th>
            <th scope="col" class="py-3 px-6">Tags</th>
            <th scope="col" class="py-3 px-6"><span class="sr-only">Edit</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.productList" :key="product.productId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ product.productId }}</th>
            <td class="py-4 px-6">{{ product.title }}</td>
            <td class="py-4 px-6">{{ product.description }}</td>
            <td class="py-4 px-6">{{ product.price }}</td>
            <td class="py-4 px-6">{{ product.quantity }}</td>
            <td class="py-4 px-6">{{ product.imageUrl }}</td>
            <td class="py-4 px-6">{{ product.tags }}</td>
            <td class="py-4 px-6 text-right">
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
/* Button */
.button {
  --main-focus: #2d8cf0;
  --font-color:  #14532d;
  --bg-color-sub: #ffffff;
  --bg-color: #ffffff;
  --main-color:  #14532d;
  position: relative;
  width: 180px;
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
  transform: translateX(130px);
  height: 100%;
  width: 45px;
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
  width: 175px;
  transform: translateX(0);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px var(--main-color);
}
</style>
