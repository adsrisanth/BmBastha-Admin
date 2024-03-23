import axios from "axios";

const URI = import.meta.env.VITE_URI;

export async function fetchBrandList(token) {
    try {
        return await axios.get(`${URI}/api/admin/brand/list/all`, {
                headers: {
                    Authorization: token
                }
            })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                return { code: -1, message: "Unable to connect server" };
            });
    } catch (err) {
        return { code: -1, message: "Unable to connect server" };
    }
}

export async function addBrandService(data, token) {
    try {
        return await axios.put(`${URI}/api/admin/brand/add`, data, {
                headers: {
                    Authorization: token
                }
            })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                return { code: -1, message: "Unable to connect server" };
            });
    } catch (err) {
        return { code: -1, message: "Unable to connect server" };
    }
}

export async function deleteBrandService(brandId, token) {
    try {
        const response = await axios.delete(`${URI}/api/admin/brand/remove/${brandId}`, {
            headers: { Authorization: `${token}` },
        });
        return response.data;
    } catch (err) {
        return { code: -1, message: "Unable to connect to server" };
    }
}

export async function updateBrandService(data, token) {
    try {
        return await axios.patch(`${URI}/api/admin/brand/update`, data, {
                headers: {
                    Authorization: token
                }
            })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                return { code: -1, message: "Unable to connect to server" };
            });
    } catch (err) {
        return { code: -1, message: "Unable to connect to server" };
    }
}
