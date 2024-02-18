import axios from 'axios';

export const fetchDataFromAPI = async () => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=3&type=boolean');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};