import {useRouteError} from "react-router-dom";
import {FC, useEffect, useState} from "react";
import {isAxiosError} from "../../data/axiosConfig.ts";
import {Collapse, Result} from "antd";

interface ErrorDisplayProps {
    errorMessage?: string;
    stackTrace?: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ errorMessage, stackTrace }) => {
    const stackFrames = stackTrace?.split('\n').filter(line => line.trim() !== '');

    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <h3 style={{ color: 'red', paddingBottom: '15px' }}>Error: {errorMessage}</h3>
            <p>Stack Trace:</p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {stackFrames?.map((frame, index) => {
                    const componentMatch = frame.match(/at (\w+) \((.+)\)/);
                    const anonymousMatch = frame.match(/at (.+) \((.+)\)/);
                    const simpleMatch = frame.match(/at (.+)/);

                    let componentName: string | null = null;
                    let fileLink: string | null = null;
                    let otherInfo: string | null = null;

                    if (componentMatch && componentMatch[1] && componentMatch[2]) {
                        componentName = componentMatch[1];
                        fileLink = componentMatch[2];
                    } else if (anonymousMatch && anonymousMatch[1] && anonymousMatch[2]) {
                        componentName = anonymousMatch[1];
                        fileLink = anonymousMatch[2];
                    } else if (simpleMatch && simpleMatch[1]) {
                        otherInfo = simpleMatch[1];
                    }

                    return (
                        <li key={index} style={{ marginBottom: '5px' }}>
                            {componentName && (
                                <span style={{ color: '#2b542b', fontWeight: 'bold' }}>{componentName}</span>
                            )}
                            {fileLink && (
                                <>
                                    {' '}
                                    (<a
                                    href={fileLink}
                                    style={{
                                        color: 'dimgray',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Navigating to:', fileLink);
                                        // In a real application, you might want to handle this navigation differently
                                    }}
                                >
                                    {fileLink}
                                </a>)
                                </>
                            )}
                            {otherInfo && !componentName && !fileLink && (
                                <span>{otherInfo}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const PageError = () => {

    const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined)
    const [code, setCode] = useState<number>(0)
    const [name, setName] = useState<string|undefined>(undefined)
    const [track, setTrack] = useState<string|undefined>(undefined)
    const error = useRouteError()

    useEffect(() => {
        if (error instanceof TypeError) {
            setErrorMessage(error.message)
            setTrack(error.stack)
            setName(error.name)
        }
        if (isAxiosError(error)) {
            setErrorMessage(error.message)
            setCode(error.status as number)
            setTrack(error.stack)
        }
    }, [error]);

    return(
        <Result
            status={code > 0 ? code as 404 : 'error'}
            title={code > 0 ? code : errorMessage}
            subTitle={code > 0 ? errorMessage : name}
            extra={
                <Collapse items={[
                    {
                        key: 1,
                        label: 'Voir stack trace',
                        collapsible: 'header',
                        children: <ErrorDisplay
                            errorMessage={errorMessage}
                            stackTrace={track}
                        />
                    }
        ]} />}  />
    )
}

export default PageError;