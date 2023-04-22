import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { TodoistItemEvent, TodoistItemPatchEvent } from '../types';
import { buildNotionRequestBody } from './buildNotionTask';
import {
    createNotionDatabasePage,
    patchNotionDatabasePage,
} from './notionQueries';

export const addNewTodoistTaskToNotion = async (
    itemEvent: TodoistItemEvent
) => {
    const notionRequestBody = await buildNotionRequestBody(itemEvent, 'create');
    await createNotionDatabasePage(notionRequestBody as CreatePageParameters);
};

export const patchNotionPageUsingTodoistTask = async (
    itemEvent: TodoistItemPatchEvent
) => {
    const notionRequestBody = await buildNotionRequestBody(itemEvent, 'update');
    await patchNotionDatabasePage(itemEvent.id, notionRequestBody);
};
