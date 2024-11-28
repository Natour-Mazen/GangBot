// utils/response.js
function handleResponse(res, data, response_code, message) {
    if (response_code >= 400) {
        return res.status(response_code).json({ message: message });
    }
    return res.json(data);
}

module.exports = handleResponse;