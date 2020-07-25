export interface ContactInterface {
    clientSources: string;
    clientStatus: string;
    email: string;
    id: string;
    name: string;
    phones: string[];
    position: string;
    responsible: ResponsibleInterface;
}

export interface ResponsibleInterface {
    id: string;
    name: string;
    role: string | null;
    __typename: string;
}
