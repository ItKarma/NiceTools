// Exemplo com axios
import axios from 'axios';

axios.get('http://localhost:3000/gateway/allbins3', {
  params: {
    gg: '4268070357838111|04|2028|851'
  }
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});
