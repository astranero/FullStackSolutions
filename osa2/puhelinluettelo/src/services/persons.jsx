import axios from "axios"
const INITIAL_URL = "http://localhost:3001/persons"

const getAll = () => {
    console.log("effect")
    return axios.get(`${INITIAL_URL}`)
}


export const update = (newObj) => {
    console.log(newObj)
    return axios.put(`${INITIAL_URL}/${newObj.id}`, newObj).then( response => {
        console.log("promise fulfilled")
        return response.data
    })}

export const create = (newObj) => {
    console.log("effect")
    return axios.post(`${INITIAL_URL}`, newObj).then( response => {
        console.log("promise fulfilled")
        return response.data
    })}

export const deletePerson = (id) =>  {
    return axios.delete(`${INITIAL_URL}/${id}`).then( response => {
        console.log("succesful deletion")
        return response.data
    }).catch("Failed deletion")
}

export default { 
    getAll: getAll, 
    create: create, 
    update: update,
    deletePerson: deletePerson,
    }
