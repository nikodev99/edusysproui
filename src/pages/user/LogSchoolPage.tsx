import {Card} from "antd";

const LogSchoolPage = () => {
    return(
        <div className='login__page__wrapper'>
            <div className="login__page__logo__wrapper">
                <img src="/edusyspro.svg" alt="logo" className="login__page__logo"/>
            </div>
            <Card title="Connexion" bordered={false} className="login__page__card"></Card>
        </div>
    )
}

export default LogSchoolPage;