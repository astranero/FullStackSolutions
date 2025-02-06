import axios from "axios"
const port = process.env.BACKEND_PORT || 3001
const INITIAL_URL = process.env.REACT_APP_BACKEND_URL || '/api/persons';

const getAll = () => {
    return axios.get(`${INITIAL_URL}`)
    .then(response => response.data)
    .catch( error => {
        console.error("Error fetching data:", error)
        throw error;
    });
}


export const update = (newObj) => {
    console.log(newObj)
    return axios.put(`${INITIAL_URL}/${newObj.id}`, newObj).then( response => {
        return response.data
    }).catch( error => {
        console.error('Error updating person:', error.response?.data?.error || error.message )
        throw error
    })
}


export const create = (newObj) => {
    return axios.post(`${INITIAL_URL}`, newObj).then( response => {
        console.log("Response data:", response.data)
        return response.data
    }).catch( error => {
        console.error('Error creating person:', error.response?.data?.error || error.message )
        throw error
    })}


export const deletePerson = (id) =>  {
    return axios.delete(`${INITIAL_URL}/${id}`).then( response => {
        return response.data
    }).catch( error => {
        console.error('Error deleting person:', error.response?.data?.error || error.message )
        throw error
    })}


export default { 
    getAll: getAll, 
    create: create, 
    update: update,
    deletePerson: deletePerson,
}
