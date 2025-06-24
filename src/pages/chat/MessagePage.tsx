import {Button, Result} from "antd";
import {redirectTo} from "../../context/RedirectContext.ts";
import {text} from "../../core/utils/text_display.ts";

const MessagePage = () => {
    return(
        <Result
            status='info'
            title="Le module communication n'est pas encore disponible."
            extra={
                <Button onClick={() => redirectTo(text.home.href)}>
                    Retour au tableau de bord
                </Button>
            }
        />
    )
}

export default MessagePage;