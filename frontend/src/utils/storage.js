export const loadData = () => {
  try {
    const savedData = localStorage.getItem('clinisysData');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return null;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem('clinisysData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const initializeData = (initialData) => {
  const savedData = loadData();
  return savedData || initialData;
};