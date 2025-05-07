import axios from 'axios';

export const Api = {
  API_URL: 'https://myrevisionplus.com/api/v1/',

  getInstance() {
    const token = localStorage.getItem('authToken'); 
    console.log("authtoken",token)
    return axios.create({
      baseURL: this.API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : '', 
      },
    });
  },

  get(url) {
    return this.getInstance().get(url);
  },

  post(url, data) {
    return this.getInstance().post(url, data);
  },

  put(url, data) {
    return this.getInstance().put(url, data);
  },

  delete(url) {
    return this.getInstance().delete(url);
  },

 
  patch(url, data) {
    return this.getInstance().patch(url, data);
  },
};
