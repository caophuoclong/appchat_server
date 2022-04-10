import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "../configs";
import { createClient } from "redis";

const client = createClient({
    socket: {
        port: Number(REDIS_PORT!),
        host: REDIS_HOST!,

    },
    password: REDIS_PASSWORD!,

});
export default client;