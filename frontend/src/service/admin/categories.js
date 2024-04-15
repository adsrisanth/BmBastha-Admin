import axios from 'axios';

const URI = import.meta.env.VITE_URI;

export async function fetchCategoriesList(token) {
    try {
        const response = await axios.get(`${URI}/api/admin/categories/list/all`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories list:', error);
        return { code: -1, message: 'Unable to fetch categories list' };
    }
}

export async function addCategoriesService(data, token) {
    try {
        const response = await axios.put(`${URI}/api/admin/categories/add`, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        return { code: -1, message: 'Unable to add category' };
    }
}

export async function deleteCategoriesService(categoriesId, token) {
    try {
        const response = await axios.delete(`${URI}/api/admin/categories/remove/${categoriesId}`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        return { code: -1, message: 'Unable to delete category' };
    }
}

export async function updateCategoriesService(data, token) {
    try {
        const response = await axios.post(`${URI}/api/admin/categories/update`, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        return { code: -1, message: 'Unable to update category' };
    }
}
