



export type NodeProps = {
    id: string
    name: string
    inputPorts: PortProps[]
    outputPorts: PortProps[]
}


export type PortProps = {
    id: string
    name: string
    dataType?: DataType
}

export type DataType = 
    |   'txt'
    |   'url'
    |   'json'
    |   'md'
    |   'png'
    |   'jpg'