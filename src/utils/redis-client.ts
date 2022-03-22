import { REDIS_HOST, REDIS_PORT } from "../configs";
import { createClient } from "redis";
const client = createClient({
    socket: {
        port: Number(REDIS_PORT!),
        host: REDIS_HOST!
    }

});
export default client;