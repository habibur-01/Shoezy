import api from "../../api/index";
import { BILLING_ADDRESS_ENDPOINT, HAS_ADDRESS_ENDPOINT } from "../../endpoint";
import { getAccessToken } from "../../utils/getAccessToken";
export const addBillingAddress = async data => {
  try {
    const result = await api.post(BILLING_ADDRESS_ENDPOINT, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ adBillingAddress ~ error:', error);
  }
};
export const getBillingAddress = async id => {
  try {
    const result = await api.get(`${BILLING_ADDRESS_ENDPOINT}/${id}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ adBillingAddress ~ error:', error);
  }
};
// has billing address
export const hasBillingAddress = async ()=> {
  try {
    const result = await api.get(HAS_ADDRESS_ENDPOINT, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ adBillingAddress ~ error:', error);
    throw(error)
  }
};