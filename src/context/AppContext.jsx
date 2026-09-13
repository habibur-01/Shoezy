import { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GET_CATEGORIES_ENDPOINT, GET_NAVBAR_ENDPOINT, GET_SUBCATEGORIES_ENDPOINT } from "../endpoint";
import { setCategories, setCategory, setSubCategory } from "../redux/features/initial/initialSlice";
import api from "../api/index"; 

export const AppContext = createContext(null)
const AppProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoryRes, subCategoriesRes, categoriesRes] = await Promise.allSettled([
                    api.get(`${GET_CATEGORIES_ENDPOINT}`),
                    api.get(`${GET_SUBCATEGORIES_ENDPOINT}`),
                    api.get(`${GET_NAVBAR_ENDPOINT}`),
                ]);

                if (categoryRes.status === "fulfilled" && categoryRes.value?.data?.data) {
                    dispatch(setCategory(categoryRes.value.data.data));
                }
                if (subCategoriesRes.status === "fulfilled" && subCategoriesRes.value?.data?.data) {
                    dispatch(setSubCategory(subCategoriesRes.value.data.data));
                }
                if (categoriesRes.status === "fulfilled" && categoriesRes.value?.data?.data) {
                    dispatch(setCategories(categoriesRes.value.data.data));
                }
            } catch (error) {
                console.error("Initial API load failed:", error);
            }
        };

        loadInitialData();
    }, [dispatch]);

    const data = {

    }

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    )

}

export default AppProvider