import './App.css'
import {metadata} from "./utils/metadata.tsx";
import {Image} from "antd";

metadata({
    title: "Home",
    description: "New Home Page"
});

const App = () => {

    return(
        <div><Image src={'/favicon.svg'} /> </div>
    )
}

export default App
