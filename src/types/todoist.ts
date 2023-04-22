export interface TodoistItemEventRoot {
    event_data: TodoistItemEvent;
    event_data_extra?: {
        old_item: TodoistItemEvent;
        update_intent: TodoistItemUpdateIntent;
    };
    event_name: TodoistItemEventName;
    initiator: TodoistInitiator;
    user_id: string;
    version: string;
}

export interface TodoistItemEvent {
    added_at: string;
    added_by_uid: string;
    assigned_by_uid: string | null;
    checked: boolean;
    child_order: number;
    collapsed: boolean;
    completed_at: string | null;
    content: string;
    description: string;
    due: TodoistDueDate | null;
    id: string;
    is_deleted: boolean;
    labels: string[];
    parent_id: string | null;
    priority: TodoistPriority | null;
    project_id: string;
    responsible_uid: string | null;
    section_id: string | null;
    sync_id: number | null;
    url: string;
    user_id: string;
}

export interface TodoistItemPatchEvent extends Partial<TodoistItemEvent> {
    /** must have `id` as it is used to find corresponding Notion DB item */
    id: string;
}

export interface TodoistInitiator {
    email: string;
    full_name: string;
    id: string;
    image_id: string | null;
    is_premium: boolean;
}

export enum TodoistItemEventName {
    Added = 'item:added',
    Completed = 'item:completed',
    Deleted = 'item:deleted',
    Updated = 'item:updated',
    Uncompleted = 'item:uncompleted',
}

export type TodoistItemUpdateIntent =
    | 'item_completed'
    | 'item_deleted'
    | 'item_updated'
    | 'item_uncompleted';

export interface TodoistDueDate {
    date: string; // "2023-04-03" or "2023-04-03T13:00:00"
    is_recurring?: boolean;
    lang?: string | null;
    string?: string | null;
    timezone?: string | null;
}

export enum TodoistPriority {
    P1 = 4,
    P2 = 3,
    P3 = 2,
    P4 = 1,
}
