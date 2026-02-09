import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getCities, getCountries, getStates } from "../../utils/locationApi";
import { ChevronDown, Search } from "lucide-react";
import { addBillingAddress, getBillingAddress } from "../../server/billing/billing";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// 🔹 Default form values
const initialValues = {
    firstName: "",
    lastName: "",
    phoneCountry: "+880",
    phoneNumber: "",
    street: "",
    addressCountry: "",
    state: "",
    city: "",
    zip: "",
};

// 🔹 Validation Schema
const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    addressCountry: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    zip: Yup.string().required("ZIP is required"),
});

const BillingAddress = () => {
    const user = useSelector((state) => state.auth.user);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [optionOpen, setOpenOption] = useState(null)
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [selectedPhoneCode, setSelectedPhoneCode] = useState(null);


    // 🔹 Fetch all countries on mount
    useEffect(() => {
        (async () => {
            const countryData = await getCountries();
            setCountries(countryData);
        })();
    }, []);

    // fetch state
    useEffect(() => {
        (async () => {
            const stateData = await getStates(selectedCountry);
            setStates(stateData);
        })();
    }, [selectedCountry])

    // fetch cities
    useEffect(() => {
        (async () => {
            const cities = await getCities(selectedCountry, selectedState);
            setCities(cities);
        })();
    }, [selectedCountry, selectedState])

    const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenOption(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchBilling = async () => {
            console.log(user?.user_id)
            const result = await getBillingAddress(user?.user_id)
            console.log("🚀 ~ fetchBilling ~ result:", result)
        }
        fetchBilling()
    }, [])

    return (
        <div className="flex-1 bg-[var(--color-background)] shadow-all rounded-xl px-16 py-12" ref={dropdownRef}>
            <h2 className="text-[var(--color-red)] font-semibold mb-6 text-lg">
                Update Your Address
            </h2>

            <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        setLoading(true)
                        const addrressData = {

                            firstName: values?.firstName,
                            lastName: values?.lastName,
                            phone: `${values.phoneCountry}${values.phoneNumber}`,
                            shippingAddress: {
                                street: values.street,
                                city: values.city,
                                state: values.state,
                                zip: values.zip,
                                country: values.addressCountry,
                            }
                        }

                        const res = await addBillingAddress(addrressData);
                        console.log("🚀 ~ BillingAddress ~ res:", res)
                        if (res) {
                            toast.success("Logged in successfully!");
                        }
                    } catch (error) {
                        console.log("🚀 ~ BillingAddress ~ error:", error)
                    } finally {

                        setLoading(false)
                    }


                }}
            >
                {({ values, setFieldValue, handleSubmit, handleBlur, handleChange, errors, touched }) => {
                    // 🔹 Phone country change


                    return (
                        <Form className="space-y-6">
                            {/* 🔹 Name Fields */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        name="firstName"
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        onBlur={handleBlur}
                                        value={values.firstName}
                                        className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:ring-1 focus:ring-red-400"
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <p className="text-[var(--color-danger)] text-xs mt-1">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        name="lastName"
                                        placeholder="Last Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastName}
                                        className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:ring-1 focus:ring-red-400"
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <p className="text-[var(--color-danger)] text-xs mt-1">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 🔹 Phone Field */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <div className="flex gap-0 items-center relative">
                                        <div onClick={() => setOpenOption('code')} className="py-3 flex items-center gap-1 bg-[var(--color-gray)] text-sm px-3 rounded-l-md border-r border-gray-300">
                                            {selectedPhoneCode ? <img src={selectedPhoneCode?.flag} alt="flag" className="w-4 object-contain" /> : "🌍"}
                                            <p>{selectedPhoneCode?.code || "+880"}</p>
                                            <ChevronDown size={16} />
                                        </div>
                                        <input
                                            name="phoneNumber"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phoneNumber}
                                            type="number"
                                            placeholder="Write number"
                                            className="flex-1 bg-[var(--color-gray)] rounded-r-md px-3 py-3 text-sm focus:ring-1 focus:ring-red-400"
                                        />
                                        {
                                            optionOpen === 'code' && <div className=" absolute -top-1/2 translate-y-1/2 bg-[var(--color-gray)] shadow-all h-44 z-10 overflow-hidden overflow-y-scroll px-5 py-2" >
                                                {countries?.map((item) => <div className="flex gap-2 py-2 hover:cursor-pointer" key={item?.code} onClick={() => {
                                                    setSelectedPhoneCode({ flag: item?.flag, code: item.phoneCode });
                                                    setFieldValue('phoneCountry', item?.phoneCode)
                                                    setOpenOption(null)
                                                }}>
                                                    <img src={item.flag} alt="flag" className=" w-4 object-contain" />
                                                    <p>{item?.phoneCode}</p>
                                                </div>)}
                                            </div>
                                        }
                                    </div>
                                    {errors.phoneNumber && touched.phoneNumber && (
                                        <p className="text-[var(--color-danger)] text-xs mt-1">
                                            {errors.phoneNumber}
                                        </p>
                                    )}
                                </div>


                            </div>

                            {/* 🔹 Billing Address Section */}
                            <div className="pt-2">
                                <h2 className="text-[var(--color-red)] font-semibold mb-6 text-lg">
                                    Billing Address
                                </h2>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Country */}
                                    <div className="relative">
                                        <label className="block text-sm text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <div
                                            onClick={() => setOpenOption("country")}
                                            className="bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm cursor-pointer flex justify-between items-center"
                                        >
                                            <span>{selectedCountry || "Select Country"}</span>
                                            <ChevronDown size={16} />
                                        </div>
                                        {
                                            optionOpen === 'country' && <div className="absolute w-full bg-[var(--color-gray)] shadow-all  rounded-md shadow-all max-h-48 overflow-y-auto z-10">
                                                <div className="bg-gray-200 flex items-center rounded-md mx-2 my-2 px-2 h-10">
                                                    <Search size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className="w-full h-full px-2 text-sm outline-none"
                                                    />
                                                </div>
                                                {filtered.length > 0 ? (
                                                    filtered.map((c) => (
                                                        <div
                                                            key={c.code}
                                                            onClick={() => {
                                                                setSelectedCountry(c.name)
                                                                setFieldValue('addressCountry', c.name)
                                                                setOpenOption(false);
                                                            }}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-md"
                                                        >
                                                            {c.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500 text-sm">No country found</div>
                                                )}
                                            </div>
                                        }
                                    </div>

                                    {/* State */}
                                    <div className="relative">
                                        <label className="block text-sm text-gray-700 mb-1">
                                            Division
                                        </label>
                                        <div
                                            onClick={() => setOpenOption("state")}
                                            className="bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm cursor-pointer flex justify-between items-center"
                                        >
                                            <span>{selectedState || "Select State"}</span>
                                            <ChevronDown size={16} />
                                        </div>
                                        {
                                            optionOpen === 'state' && <div className="absolute w-full bg-[var(--color-gray)] shadow-all  rounded-md shadow-all max-h-48 overflow-y-auto z-10" >
                                                {states?.map((item) => <div className="flex gap-2 py-2 hover:cursor-pointer px-4" key={item?.state_code} onClick={() => {
                                                    setSelectedState(item?.name);
                                                    setFieldValue('state', item.name)
                                                    setOpenOption(null)
                                                }}>

                                                    <p className="text-sm">{item?.name}</p>
                                                </div>)}
                                            </div>
                                        }
                                    </div>

                                    {/* City */}
                                    <div className="relative">
                                        <label className="block text-sm text-gray-700 mb-1">
                                           District
                                        </label>
                                        <div
                                            onClick={() => setOpenOption("city")}
                                            className="bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm cursor-pointer flex justify-between items-center"
                                        >
                                            <span>{selectedCity || "Select City"}</span>
                                            <ChevronDown size={16} />
                                        </div>
                                        {
                                            optionOpen === 'city' && <div className="absolute w-full bg-[var(--color-gray)] shadow-all  rounded-md shadow-all max-h-48 overflow-y-auto z-10" >
                                                {cities?.map((item, index) => <div className="flex gap-2 py-2 hover:cursor-pointer px-4" key={index} onClick={() => {
                                                    setSelectedCity(item);
                                                    setFieldValue('city', item)
                                                    setOpenOption(null)
                                                }}>

                                                    <p className="text-sm">{item}</p>
                                                </div>)}
                                            </div>
                                        }
                                    </div>


                                    {/* ZIP */}
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">
                                            ZIP / Postal Code
                                        </label>
                                        <input
                                            name="zip"
                                            placeholder="e.g. 1207"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.zip}
                                            className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:ring-1 focus:ring-red-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            name="street"
                                            placeholder="House / Road / Area"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.street}
                                            className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:ring-1 focus:ring-red-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 Buttons */}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-100 h-10"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-red" onClick={handleSubmit}>
                                    Save Changes
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default BillingAddress;
