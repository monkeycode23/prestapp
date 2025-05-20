import { useEffect, useState } from 'react';


function useLocalStorage(
  key,
  initialValue
) {
  // State to store our value
  // Pass  initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const UpdateValue = (value) => {
    deleteValue()
    window.localStorage.setItem(key, JSON.stringify(value));

  }

  const deleteValue = () => {
    window.localStorage.removeItem(key);
  }

  const getValues = () => {
    return window.localStorage.getItem(key);
  }

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue,deleteValue,UpdateValue,getValues];
}




export default useLocalStorage;
