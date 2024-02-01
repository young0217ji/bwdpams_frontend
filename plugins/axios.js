export default (inter) => {

  inter.$axios.onRequest((req) => {

  });

  // response
  inter.$axios.onResponse((res) => {

  });

  inter.$axios.onError((error) => {

    if(error.response?.status == 401){

      inter.$auth.logout().then((result) => {
        localStorage.clear();
        inter.redirect("/login");
      })
    } else if (error.name === 'ExpiredAuthSessionError') {
      inter.$auth.logout().then((result) => {
        localStorage.clear();
        inter.redirect("/login");
      })

    } else {
      window._this.axiosAlertPopOpen(error.response.data);
    }
    if (error.response) {
      console.error(`${error.response}`);
    }

  });
};