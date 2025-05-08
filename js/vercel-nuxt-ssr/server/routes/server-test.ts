import {EventHandlerRequest, H3Event} from "h3";

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
    return $fetch('https://jsonplaceholder.typicode.com/users')
})
