// src/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/index"; // your axios instance
import {
  GET_CATEGORIES_ENDPOINT,
  GET_NAVBAR_ENDPOINT,
  GET_SUBCATEGORIES_ENDPOINT,
} from "../endpoint";
import { setCategories, setCategory, setSubCategory } from "../redux/features/initial/initialSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const loadInitialData = async () => {
    try {
      const [categoryRes, subCategoriesRes, categoriesRes] = await Promise.allSettled([
        api.get(`${GET_CATEGORIES_ENDPOINT}`),
        api.get(`${GET_SUBCATEGORIES_ENDPOINT}`),
        api.get(`${GET_NAVBAR_ENDPOINT}`),
      ]);

      if (categoryRes.status === "fulfilled") {
        dispatch(setCategory(categoryRes.value.data?.data));
      }
      if (subCategoriesRes.status === "fulfilled") {
        dispatch(setSubCategory(subCategoriesRes.value.data?.data));
      }
      if (categoriesRes.status === "fulfilled") {
        dispatch(setCategories(categoriesRes.value.data?.data));
      }
    } catch (error) {
      console.error("Initial API load failed:", error);
    }
  };

  useEffect(() => {
    loadInitialData();

  }, []);

  return children;
};

export default AppInitializer;

