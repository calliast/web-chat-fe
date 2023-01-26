import { getUserData } from "../services/user.services"

export const load_ContactList = (id) => async (dispatch, getState) => {
    try {
        const response = await getUserData(id, "friends")
        if (!response.success) throw response
    } catch (error) {
        console.log(error);
    }
}