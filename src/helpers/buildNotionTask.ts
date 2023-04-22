import {
    NotionDatabasePropertyKey as NotionProperty,
    TodoistDueDate,
    TodoistItemEvent,
    TodoistItemPatchEvent,
    TodoistPriority,
    WorkSections,
} from '../types';
import {
    DATABASE_ID,
    findNotionPageIdUsingTodoistTaskId,
} from './notionQueries';
import { TN_PRIORITY_MAP, TN_STATUS_MAP } from './typeMaps';

export const buildNotionRequestBody = async (
    task: TodoistItemEvent | TodoistItemPatchEvent,
    requestType: 'create' | 'update'
) => {
    const notionProperties = await buildNotionProperties(task, requestType);

    if (requestType === 'update') {
        return {
            properties: notionProperties,
        };
    }

    const newTask = task as TodoistItemEvent;

    const newPageItems = {
        parent: {
            database_id: DATABASE_ID,
        },
        icon: {
            type: 'emoji',
            emoji: '☑️',
        },
        children: getNotionTaskContent(newTask.description),
    };

    return {
        properties: notionProperties,
        ...newPageItems,
    };
};

export const buildNotionProperties = async (
    task: TodoistItemEvent | TodoistItemPatchEvent,
    requestType: 'create' | 'update'
) => {
    const isExistingTask = requestType === 'update';
    const isNewTask = requestType === 'create';
    const includePriority = isNewTask || (isExistingTask && !!task.priority);
    const includeSection = isNewTask || (isExistingTask && !!task.section_id);

    let properties: { [key: string]: any } = {};

    if (task.content) {
        properties.Name = getNotionTaskName(task.content);
    }

    if (includePriority) {
        const priority = task.priority ?? TodoistPriority.P4;
        properties[NotionProperty.Priority] = getNotionPriority(priority);
    }

    if (includeSection) {
        const section =
            (task.section_id as WorkSections) ?? WorkSections.BACKLOG;
        properties[NotionProperty.Status] = getNotionStatus(section);
    }

    if (task.due) {
        properties[NotionProperty.Scheduled_for] = getNotionScheduledFor(
            task.due
        );
    }

    if (task.url) {
        properties[NotionProperty.Task_link] = {
            url: task.url,
        };
    }

    if (task.checked) {
        properties[NotionProperty.Done] = {
            checkbox: task.checked,
        };
    }

    if (task.parent_id) {
        const parentTask = await getNotionParentTask(task.parent_id);
        properties[NotionProperty.Parent_task] = parentTask;
    }

    return properties;
};

export const getNotionTaskName = (content: string) => {
    return {
        title: [
            {
                text: {
                    content,
                },
            },
        ],
    };
};

export const getNotionPriority = (priority: TodoistPriority) => {
    return {
        select: TN_PRIORITY_MAP[priority],
    };
};

export const getNotionStatus = (status: WorkSections) => {
    return {
        select: TN_STATUS_MAP[status],
    };
};

export const getNotionScheduledFor = (date: TodoistDueDate) => {
    return {
        date: {
            start: date?.date,
            end: null,
        },
    };
};

export const getNotionParentTask = async (parentId: string) => {
    const notionParentTaskId = await findNotionPageIdUsingTodoistTaskId(
        parentId
    );
    if (!notionParentTaskId) {
        return;
    }

    return {
        relation: [
            {
                id: notionParentTaskId,
            },
        ],
    };
};

export const getNotionTaskContent = (description: string) => {
    return [
        {
            object: 'block',
            type: 'heading_3',
            heading_3: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: 'Description',
                        },
                    },
                ],
            },
        },
        {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: description,
                        },
                    },
                ],
            },
        },
    ];
};
