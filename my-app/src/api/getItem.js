import axios from 'axios';

export function getAllItems() {
    return axios.get("http://localhost:8080/items")
    .then((response) => response.data);
}
