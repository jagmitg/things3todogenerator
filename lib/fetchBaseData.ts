export const fetchBaseData = async (listName, jsonLists, localLists) => {
  if (jsonLists.some((list) => list.name === listName)) {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/api/list?list=${listName}`
    );
    const data = await response.json();
    return data.sections || data;
  }

  const localList = localLists.find((list) => list.key === listName);
  if (localList) {
    return localList.value.sections || localList.value;
  }

  throw new Error('List not found');
};
