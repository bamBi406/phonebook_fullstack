import axios from "axios";
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    return (
        axios
            .get(baseUrl)
            .then(r => r.data)
    )
}

const create = newObject => {
    return (
        axios
            .post(baseUrl, newObject)
            .then(r => r.data)
    )
}

const remove = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => (
    axios
        .put(`${baseUrl}/${id}`, newObject)
        .then(r => r.data)
)

export default { getAll, create, remove, update }
