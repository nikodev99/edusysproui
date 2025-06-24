import {Button, Result} from "antd";
import {redirectTo} from "../../context/RedirectContext.ts";
import {text} from "../../core/utils/text_display.ts";

const LibraryListPage = () => {
    return (
        <Result
            status='info'
            title="Le module Bibliothèque n'est pas encore disponible."
            extra={
                <Button type='primary' key='console' onClick={() => redirectTo(text.home.href)}>
                    Retourner au tableau de bord
                </Button>
            }
        />
    )
}

export default LibraryListPage;