import axios from "axios";
import { notify } from "./notify";

export function httpErrorMessages(error: unknown): void {
    if (axios.isAxiosError(error) && error.response) {
        let newMessage = ""
        getMessages(error.response?.data?.messages).forEach((messages) => {
            newMessage = messages+"\n"+newMessage
        });
        return notify(newMessage, "warning");
    }    
}

function getMessages(messages: string | Array<string>): Array<string> {
    if(typeof(messages) == "string") return [messages]
    return messages
}