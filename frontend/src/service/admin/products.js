import axios from "axios";

const URI = import.meta.env.VITE_URI;

export async function fetchProductList(token) {
    try {
        return await axios.get(`${URI}/api/admin/product/list/all`, {
            headers: {
                Authorization: token
            }
        })
        .then((result) => {
            return result.data;
        })
        .catch((err) => {
            return { code: -1, message: "Unable to connect to the server" };
        });
    } catch (err) {
        return { code: -1, message: "Unable to connect to the server" };
    }
}

export async function addProductService(data, token) {
    try {
        return await axios.put(`${URI}/api/admin/product/add`, data, {
            headers: {
                Authorization: token
            }
        })
        .then((result) => {
            return result.data;
        })
        .catch((err) => {
            return { code: -1, message: "Unable to connect to the server" };
        });
    } catch (err) {
        return { code: -1, message: "Unable to connect to the server" };
    }
}

export async function deleteProductService(productId, token) {
    try {
        const response = await axios.delete(`${URI}/api/admin/product/remove/${productId}`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        return { code: -1, message: "An error occurred while trying to delete the product." };
    }
}
