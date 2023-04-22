import {
    NotionStatus,
    WorkSections,
    TodoistPriority,
    NotionPriority,
    NotionStatusValues,
    NotionPriorityValues,
} from '../types';

/** TN (Todoist to Notion) map from Todoist Sections to Notion Status */
export const TN_STATUS_MAP: Record<WorkSections, NotionStatusValues> = {
    [WorkSections.INCOMING_TICKETS]: NotionStatus.ToDo,
    [WorkSections.SELECTED_FOR_DEVELOPMENT]: NotionStatus.ToDo,
    [WorkSections.IN_PROGRESS]: NotionStatus.InProgress,
    [WorkSections.CODE_REVIEW]: NotionStatus.CodeReview,
    [WorkSections.QA]: NotionStatus.InQA,
    [WorkSections.BACKLOG]: NotionStatus.OnHold,
};

/** TN (Todoist to Notion) map from Todoist Priority to Notion Priority */
export const TN_PRIORITY_MAP: Record<TodoistPriority, NotionPriorityValues> = {
    [TodoistPriority.P1]: NotionPriority.High,
    [TodoistPriority.P2]: NotionPriority.Medium,
    [TodoistPriority.P3]: NotionPriority.Low,
    [TodoistPriority.P4]: NotionPriority.Filler,
};
