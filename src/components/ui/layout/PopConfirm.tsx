import {Popconfirm as AntPopConfirm, PopconfirmProps} from 'antd'
import {useState} from "react";

export const PopConfirm = (props: PopconfirmProps) => {
    const {title, description, open, onCancel, onConfirm} = props

    const [confirmLoading, setConfirmLoading] = useState(props.okButtonProps?.loading);

    const handleOk = () => {
        setConfirmLoading(true);

        setTimeout(() => {
            setConfirmLoading(false);
            if (onConfirm) {
                onConfirm()
            }
        }, 2000);
    };

    return (
        <AntPopConfirm {...props}
           title={title}
           description={description}
           open={open}
           onConfirm={handleOk}
           okButtonProps={{ loading: confirmLoading }}
           onCancel={onCancel}
        >
            {props.children}
        </AntPopConfirm>
    )
}