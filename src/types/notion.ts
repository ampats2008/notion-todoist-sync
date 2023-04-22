import { PropertyID, PropertyType } from 'notion-types';

/** Generic notion DB types (can apply to any db) */
export interface NotionDatabase<T = NotionDatabaseProperties> {
    object: 'database';
    id: string;
    created_time: string;
    last_edited_time: string;
    in_inline: boolean;
    properties: T;
    url: string;
    archived: boolean;
}

export interface NotionDatabaseProperties {
    [key: string]: NotionDatabaseProperty;
}

export interface NotionDatabaseProperty {
    id: PropertyID;
    name: string;
    type: PropertyType;
    [key: string]: any;
}

export type NotionRelationProperty = {
    relation?: { id: string }[];
    has_more?: boolean;
};

type ISO8601Datetime = string;

export type NotionDateProperty = {
    date?: {
        start: ISO8601Datetime;
        end?: ISO8601Datetime;
    };
};
