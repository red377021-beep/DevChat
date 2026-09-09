import ReplyContext from "../context/ReplyContext";
import useReply from "../hooks/useReply";

function ReplyProvider({ children }) {

    const reply = useReply();

    return (

        <ReplyContext.Provider value={reply}>

            {children}

        </ReplyContext.Provider>

    );

}

export default ReplyProvider;