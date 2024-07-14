export const fetchConfig = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/api/config`);
  const config = await response.json();
  return config;
};
