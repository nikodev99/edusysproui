import {FaHome} from "react-icons/fa";

export const setBreadcrumb = (items: [{ href?: string, title: string }]) => {
    return [
        {
            title: (
                <div className='breadcrumb-icon'>
                    <FaHome size={20} />
                </div>
            ),
        },
        ...items
    ]
}