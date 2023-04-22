import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import {
    TodoistItemEventName as EventName,
    TodoistItemEvent,
    TodoistItemEventRoot,
} from '../types';
import {
    addNewTodoistTaskToNotion,
    patchNotionPageUsingTodoistTask,
    respondWithFailure,
    respondWithSuccess,
    verifyRequest,
} from '../helpers';
import {
    archiveNotionDatabasePage,
    changeNotionTaskCompletedStatus,
} from '../helpers/notionQueries';
import { getObjectDiff } from '../helpers/diffObject';

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    const isValidRequest = verifyRequest(event);
    if (!isValidRequest) {
        return respondWithFailure('invalid request, no action taken');
    }

    if (!event.body) {
        return respondWithFailure('no request body found, no action taken');
    }

    const parsedEvent: TodoistItemEventRoot = JSON.parse(event.body);

    const eventName = parsedEvent.event_name;
    const eventData = parsedEvent.event_data;

    const hasNoteLabel = eventData?.labels?.includes('note');
    if (!hasNoteLabel) {
        return respondWithSuccess('success, no action taken');
    }

    switch (eventName) {
        case EventName.Added:
            await addNewTodoistTaskToNotion(eventData);
            break;
        case EventName.Completed:
            await changeNotionTaskCompletedStatus(eventData.id, 'completed');
            break;
        case EventName.Deleted:
            await archiveNotionDatabasePage(eventData.id);
            break;
        case EventName.Updated:
            const partialEventData: Partial<TodoistItemEvent> = getObjectDiff(
                parsedEvent.event_data_extra?.old_item!, // old item will exist for update events
                eventData
            );

            const labelsWereChanged = partialEventData.hasOwnProperty('labels');
            const hasNoteLabel = partialEventData?.labels?.includes('note');
            const noteLabelWasAdded = labelsWereChanged && hasNoteLabel;

            if (noteLabelWasAdded) {
                await addNewTodoistTaskToNotion(eventData);
            } else {
                const patchEventData = {
                    id: eventData.id,
                    ...partialEventData,
                };
                await patchNotionPageUsingTodoistTask(patchEventData);
            }
            break;
        case EventName.Uncompleted:
            await changeNotionTaskCompletedStatus(eventData.id, 'uncompleted');
            break;
        default:
            throw new Error('unhandled item event');
    }

    return respondWithSuccess('Your function executed successfully!');
};
