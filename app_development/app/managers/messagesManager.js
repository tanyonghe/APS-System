import PhoneStorageManager from "./phoneStorageManager.js";

const TempMessagesKey = "messagesKey";
const InitialMessages = [];

function _getMessagesKey() {
  return TempMessagesKey;
}

function _getInitialMessages() {
  return InitialMessages;
}

function _storeMessagesItem(data) {
  PhoneStorageManager._storeData(TempMessagesKey, data);
}

function _retrieveMessagesItem() {
  return PhoneStorageManager._getData(TempMessagesKey);
}

function _deleteMessagesItem() {
  PhoneStorageManager._deleteData(TempMessagesKey);
}

function _resetMessages() {
  PhoneStorageManager._deleteData(TempMessagesKey);

  PhoneStorageManager._storeData(TempMessagesKey, InitialMessages);
}

export default {
  _getMessagesKey,
  _getInitialMessages,
  _retrieveMessagesItem,
  _resetMessages,
  _storeMessagesItem,
  _deleteMessagesItem
};
