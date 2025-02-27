import axios from 'axios'
const baseUrl = '/api/blogs'

let config = null

const setToken = () => {
  const token = window.localStorage.getItem('token')
  config = {
    headers: { Authorization: `Bearer ${token}` },
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObj) => {
  setToken()
  try {
    const response = await axios.post(baseUrl, newObj, config)
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'something went wrong')
    } else {
      throw new Error('Network error or no response.')
    }
  }
}

const update = async (id, newObj) => {
  setToken()
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObj, config)
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'something went wrong')
    } else {
      throw new Error('Network error or no response.')
    }
  }
}

const deleteBlog = async (id, newObj) => {
  setToken()
  try {
    const confirmDelete = window.confirm(`Remove blog ${newObj.title} by ${newObj.author}`)
    if (!confirmDelete) {
      return
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'something went wrong')
    } else {
      throw new Error('Network error or no response.')
    }
  }
}

export default { getAll, create, update, deleteBlog, setToken }
