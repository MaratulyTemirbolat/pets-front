import { HOST, TOKEN_KEY_NAME} from "./index";

import { fetcher } from "./helpers/fetcher";
const petTypesUrl = HOST + "/api/v1/petss/pettypes";

export async function getPetTypes(accessToken) {
    return fetcher(
        petTypesUrl,
        {
            headers: {
                Authorization: `${TOKEN_KEY_NAME} ${accessToken}`
            }
        }
    );
};