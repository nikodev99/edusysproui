import Block from "../ui/layout/Block.tsx";

const StudentInfo = () => {

    return(
        <>
        <Block items={[
            <div style={{height: '600px', background: 'red'}}>1</div>,
            <div style={{height: '200px', background: 'yellow'}}>2</div>,
            <div style={{height: '800px', background: 'green'}}>3</div>,
            <div style={{height: '400px', background: 'blue'}}>4</div>,
            <div style={{height: '500px', background: 'pink'}}>5</div>,
            <div style={{height: '300px', background: 'skyblue'}}>6</div>,
            <div style={{height: '300px', background: 'skyblue'}}>7</div>,
            <div style={{height: '300px', background: 'skyblue'}}>8</div>,
            <div style={{height: '300px', background: 'skyblue'}}>9</div>,
            <div style={{height: '300px', background: 'skyblue'}}>10</div>,
            <div style={{height: '300px', background: 'skyblue'}}>11</div>
        ]} />
        </>
    )
}

export default StudentInfo