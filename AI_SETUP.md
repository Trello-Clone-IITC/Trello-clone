# AI Assistant Setup Guide

This guide explains how to set up and use the AI Assistant feature in your Trello clone application.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key to use the AI features. Get one from [OpenAI's website](https://platform.openai.com/api-keys).

2. **Backend Dependencies**: The OpenAI SDK is already installed in the backend.

## Environment Setup

Add the following environment variable to your backend `.env` file:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## Features

The AI Assistant can help you with the following tasks:

### Board Management

- **Create Cards**: "Create a new card called 'Review design' in the To Do list"
- **Update Cards**: "Update the first card title to 'Updated task'"
- **Move Cards**: "Move the 'Review design' card to the Done list"
- **Create Lists**: "Create a new list called 'In Progress'"

### Information Retrieval

- **Get Board Info**: "Show me all cards in this board"
- **Search Cards**: "Find all cards with 'design' in the title"

### General Assistance

- **Board Organization**: "Help me organize my board"
- **Task Management**: "What tasks need attention?"

## How It Works

### Backend Implementation

1. **AI Service** (`backend/src/api/ai/ai.service.ts`):

   - Handles OpenAI API communication
   - Defines available functions for the AI
   - Processes user messages and executes function calls

2. **Available Functions**:

   - `createCard`: Creates new cards in specified lists
   - `updateCard`: Updates existing card properties
   - `moveCard`: Moves cards between lists
   - `createList`: Creates new lists in boards
   - `getBoardInfo`: Retrieves board structure and content
   - `searchCards`: Searches for cards by title or description

3. **API Endpoints**:
   - `POST /api/ai/chat`: Send messages to the AI
   - `GET /api/ai/functions`: Get available functions

### Frontend Implementation

1. **AI Chat Component** (`frontend/src/features/ai/components/AIChat.tsx`):

   - Modal-based chat interface
   - Real-time message display
   - Function call result visualization

2. **AI Button** (`frontend/src/features/ai/components/AIButton.tsx`):

   - Floating action button
   - Integrated into board interface

3. **Hooks** (`frontend/src/features/ai/hooks/useAIChat.ts`):
   - Manages chat state and API calls
   - Handles message history

## Usage

1. **Open AI Assistant**: Click the floating AI button in the bottom-right corner of any board
2. **Send Messages**: Type natural language requests in the chat input
3. **View Results**: The AI will respond and show any actions it performed
4. **Clear Chat**: Use the trash icon to clear the conversation history

## Example Conversations

```
User: "Create a new card called 'Review design' in the first list"
AI: "I've created a new card called 'Review design' in the 'To Do' list."

User: "Show me all cards in this board"
AI: "Here are all the cards in your board:
- To Do: Review design, Update documentation
- In Progress: Fix bug #123
- Done: Complete user research"

User: "Move the 'Review design' card to the Done list"
AI: "I've moved the 'Review design' card to the 'Done' list."
```

## Security

- All AI endpoints require authentication
- Users can only access boards they have permission to view
- Function calls are validated and executed with proper error handling

## Customization

You can extend the AI functionality by:

1. **Adding New Functions**: Define new functions in `ai.service.ts`
2. **Customizing Prompts**: Modify the system prompt for different behavior
3. **Adding UI Elements**: Create new components for specific AI features

## Troubleshooting

1. **API Key Issues**: Ensure your OpenAI API key is valid and has sufficient credits
2. **Permission Errors**: Check that users have proper board access
3. **Function Failures**: Review the function implementations for proper error handling

## Cost Considerations

- OpenAI API calls are charged per token
- Function calls may increase token usage
- Consider implementing rate limiting for production use
- Monitor usage through OpenAI's dashboard

## Future Enhancements

Potential improvements include:

- Voice input/output
- Image analysis for card attachments
- Automated board organization
- Integration with external services
- Custom AI models for specific use cases
