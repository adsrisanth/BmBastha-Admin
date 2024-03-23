<script setup>
import { useProductStore } from '@/stores/admin/ProductStore';
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { fetchProductList, addProductService } from '@/service/admin/products';
import { useLoaderStore } from '@/stores/LoaderStore';

const loaderStore = useLoaderStore();
const productStore = useProductStore();
const userStore = useUserStore();

async function fetchProductListFromDB() {
  loaderStore.showLoader = true;
  await fetchProductList(userStore.token)
    .then((result) => {
      if (result.code === 1) {
        console.log(result);
        productStore.productList = result.data;
        loaderStore.showLoader = false;
      } else {
        alert(result.message);
        loaderStore.showLoader = false;
      }
      loaderStore.showLoader = false;
    })
    .catch((err) => {
      loaderStore.showLoader = false;
    });
}

onBeforeMount(async () => {
  await fetchProductListFromDB();
});

const newItem = ref({
  productId: '',
  image: '',
  isactive: true,
  link: '',
});

async function addProduct() {
  if (newItem.value.title.length === 0 || newItem.value.image.length === 0) {
    return;
  }
  const data = {
    title: newItem.value.title,
    image: newItem.value.image,
    isactive: newItem.value.isactive,
    link: newItem.value.link,
  };
  productStore.isAddingItemInProgress = true;
  await addProductService(data, userStore.token)
    .then((result) => {
      if (result.code === 1) {
        productStore.productList.push(data);
        alert(result.message || 'Success');
      } else {
        alert(result.message);
      }
    });
  productStore.isAddingItemInProgress = false;
}

import { deleteProductService } from '@/service/admin/products';
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  loaderStore.showLoader = true;
  try {
    const result = await deleteProductService(productId, userStore.token);
    if (result.code === 1) {
      alert('Product deleted successfully');
      await fetchProductListFromDB();
    } else {
      alert('Failed to delete the product: ' + result.message);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('An error occurred while trying to delete the product.');
  } finally {
    loaderStore.showLoader = false;
  }
}

const editingProductData = ref({});
const editButtonClicked = ref(false);

function handleEditClick(product) {
  editingProductData.value = product;
  editButtonClicked.value = true;
}

const closeEditProductDialog = () => {
  editButtonClicked.value = false;
  editingProductData.value = {};
};

const refreshPage = () => {
  location.reload();
}

</script>

<template>
  <div>
    <div v-if="editButtonClicked" class="z-[100] w-full h-[100vh] absolute backdrop-blur-sm">
      <div id="default-modal" class="overflow-y-auto overflow-x-hidden flex justify-center">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Edit Product</h3>
              <button @click="closeEditProductDialog" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4">
              <input type="text" v-model="editingProductData.title" placeholder="Title" class="w-full p-2 mb-2 border rounded">
              <input type="text" v-model="editingProductData.description" placeholder="Description" class="w-full p-2 mb-2 border rounded">
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button @click="updateProduct" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Changes</button>
              <button @click="closeEditProductDialog" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="refreshPage" class="button">
      <span class="button__text">Categories Page</span>
      <span class="button__icon"><svg class="svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path><path d="M0 0h48v48h-48z" fill="none"></path></svg></span>
    </button>    
    <br>
    <div class="overflow-x-auto relative sm:rounded-lg z-10">
      <table class="w-full text-[16px] text-left text-gray-700 dark:text-gray-400">
        <tbody>
          <tr>
            <td><input v-model="newItem.title" placeholder="Title" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><input v-model="newItem.description" placeholder="Description" class="w-full p-3 text-base border-2 rounded-md"></td>
            <td><button :disabled="productStore.isAddingItemInProgress" @click="addProduct" class="px-4 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 transition-colors mx-9 my-2">{{ productStore.isAddingItemInProgress ? 'Adding ...' : 'Add' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="overflow-x-auto relative sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Product ID</th>
            <th scope="col" class="py-3 px-6">Title</th>
            <th scope="col" class="py-3 px-6">Description</th>
            <th scope="col" class="py-3 px-6"><span class="sr-only">Edit</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.productList" :key="product.product_id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ product.product_id }}</th>
            <td class="py-4 px-6">{{ product.title }}</td>
            <td class="py-4 px-6">{{ product.description }}</td>
            <td class="py-4 px-6 text-right">
              <button @click.prevent="handleEditClick(product)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
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
  transform: translateX(135px);
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
  width: 175px;
  transform: translateX(0);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px var(--main-color);
}
</style>