import AsyncStorage from "@react-native-community/async-storage";

_storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("Successfully stored \n\n" + JSON.stringify(value));
  } catch (error) {
    console.log(
      "Error occurred in storing data with key " + key + " value " + JSON.stringify(value)
    );
  }
};

_getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};

_deleteData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Successfully deleted data with key " + key);
  } catch (error) {
    console.log("Error occurred in deleting data with key " + key);
  }
};

export default {
  _storeData,
  _getData,
  _deleteData
};
