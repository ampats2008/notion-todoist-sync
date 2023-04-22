# Todoist ➡️ Notion Sync

Recently, I created a serverless function for automatically syncing my Todoist tasks with my Notion Tasks database. It employs a unidirectional data flow (from Todoist to Notion) by listening to the Todoist Webhooks API for Todoist task-related events, and will create, update, or delete Notion pages based on those events.

This repo contains selected portions of that _private_ project that I have chosen to make public.

This project will not work properly on its own, but you may pick and choose elements to use for your own integration if you wish.

Most of the work for this project went into creating TypeScript types to model the data received from the Todoist Webhooks API, as well as creating the types to model the data sent to the Notion API. You'll find these models in the `src/types` directory.

## Tech involved in this project

-   Node.JS
-   TypeScript
-   Serverless Framework
-   AWS Lambda

## How it works

Any task which is created, updated, or deleted in Todoist will trigger a Todoist Webhooks API event. Each event sends a POST request to my AWS API Gateway, which invokes this serverless function (while passing along the data it received from Todoist). See `./src/handlers/todoist-tasks.ts` for the entry point of the program.

If the Todoist task does not contain a `@note` label, then the task will be ignored. Otherwise, the Todoist task will be synced to my Notion Tasks Database.

This allows me to track all my tasks in Todoist, regardless of their level of complexity, and specify that only certain tasks (the complex ones) should be accompanied by a Notion page (which I use for storing detailed notes / doing background research).
