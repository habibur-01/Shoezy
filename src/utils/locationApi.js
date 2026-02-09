// src/utils/locationApi.js
import axios from "axios";

const BASE_COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags";
const BASE_COUNTRIESNOW_URL = "https://countriesnow.space/api/v0.1/countries";

export const getCountries = async () => {
  try {
    const { data } = await axios.get(BASE_COUNTRIES_URL);
    return data
      .filter((c) => c.idd?.root)
      .map((c) => ({
        name: c.name.common,
        code: c.cca2,
        phoneCode: c.idd.root + (c.idd.suffixes?.[0] || ""),
        flag: c.flags?.png,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Error fetching countries:", err);
    return [];
  }
};

export const getStates = async (countryName) => {
  if (!countryName) return [];
  try {
    const { data } = await axios.post(`${BASE_COUNTRIESNOW_URL}/states`, {
      country: countryName,
    });
    return data.data.states || [];
  } catch (err) {
    console.error("Error fetching states:", err);
    return [];
  }
};

export const getCities = async (countryName, stateName) => {
  if (!countryName || !stateName) return [];
  try {
    const { data } = await axios.post(`${BASE_COUNTRIESNOW_URL}/state/cities`, {
      country: countryName,
      state: stateName,
    });
    return data.data || [];
  } catch (err) {
    console.error("Error fetching cities:", err);
    return [];
  }
};
