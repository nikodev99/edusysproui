import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {Layout} from "antd";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import Header from "./components/header/Header.tsx";

metadata({
    title: "Dashboard",
    description: "New Home Page"
});

const App = () => {
    
    return(
        <Layout className="App">
            <Sidebar />
            <Layout>
                <Header />
                <Layout.Content className='content'>

                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default App
