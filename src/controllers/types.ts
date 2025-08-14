export enum LinkPrecedence {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

export type Contact = {
    id: number;
    phoneNumber: string | null;
    email: string | null;
    linkedId: number | null;
    linkPrecedence: LinkPrecedence;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type ContactResponse = {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}

export type IdentifyRequest = {
    email?: string | null;
    phoneNumber?: string | null;
}
