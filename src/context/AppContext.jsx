import { createContext } from "react";
import { useDispatch } from "react-redux";
import { GET_CATEGORIES_ENDPOINT, GET_NAVBAR_ENDPOINT, GET_SUBCATEGORIES_ENDPOINT } from "../endpoint";
import { setCategories, setCategory, setSubCategory } from "../redux/features/initial/initialSlice";

export const AppContext = createContext(null)
const AppProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoryRes, subCategoriesRes, categoriesRes] = await Promise.all([
                    api.get(`${GET_CATEGORIES_ENDPOINT}`),
                    api.get(`${GET_SUBCATEGORIES_ENDPOINT}`),
                    api.get(`${GET_NAVBAR_ENDPOINT}`),

                ]);
                dispatch(setCategory(categoryRes.data?.data));
                dispatch(setSubCategory(subCategoriesRes.data?.data));
                dispatch(setCategories(categoriesRes.data?.data));

            } catch (error) {
                console.error("Initial API load failed:", error);
            }
        };

        loadInitialData();
    }, []);

    const data = {

    }

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    )

}

export default AppProvider