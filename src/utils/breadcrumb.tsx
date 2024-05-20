import {Home} from "lucide-react";

export const setBreadcrumb = (items: [{ href?: string, title: string }]) => {
    return [
        {
            title: (
                <div className='breadcrumb-icon'>
                    <Home size={20} />
                </div>
            ),
        },
        ...items
    ]
}