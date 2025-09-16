# Prompt Run History

The Prompt Run History feature allows users to track and view the complete history of all prompt executions, including timestamps, responses, execution times, and error information.

## Features

### 📊 Comprehensive Tracking

- **Timestamp**: Every prompt run is logged with precise timing
- **Response Storage**: Full AI responses are saved for future reference
- **Execution Metrics**: Track execution time and token usage
- **Error Handling**: Failed executions are logged with error details
- **Status Tracking**: Success, error, and timeout statuses

### 🎯 User Experience

- **Visual History**: Clean, organized display of all prompt runs
- **Expandable Details**: Click on any run to see full prompt and response
- **Copy Responses**: One-click copying of AI responses
- **Status Indicators**: Color-coded badges for quick status identification
- **Performance Metrics**: Execution time and token usage display

### 🔧 Technical Implementation

#### Database Schema

```sql
-- prompt_run_history table
CREATE TABLE public.prompt_run_history (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid references public.prompts on delete cascade,
  user_id     uuid references auth.users on delete cascade,
  prompt_text text not null,                    -- The prompt text at time of execution
  response    text not null,                    -- The AI response
  model       text not null,                    -- The model used
  tokens_used integer,                          -- Number of tokens used (if available)
  execution_time_ms integer,                    -- Time taken to execute in milliseconds
  status      text not null default 'success',  -- success, error, timeout
  error_message text,                           -- Error message if status is error
  created_at  timestamptz default now()
);
```

#### API Endpoints

- `POST /api/prompt/run` - Executes prompt and logs to history
- `GET /api/prompts/[id]/history` - Retrieves run history for a prompt

#### Components

- `PromptRunHistory.tsx` - Main component for displaying run history
- Integrated into `PromptsTable.tsx` for seamless access

## Setup Instructions

### 1. Database Migration

Run the migration script to create the required database table:

```bash
node run-migration.js
```

Or manually execute the SQL in your Supabase dashboard:

```sql
-- Copy contents from: supabase/migrations/20240321000000_add_prompt_run_history.sql
```

### 2. Verify Installation

After running the migration:

1. Navigate to any prompt in your dashboard
2. Click "Run Prompt" to execute it
3. Click "Show Run History" to view the execution history
4. Verify that the run appears in the history with all details

## Usage

### Viewing Run History

1. Select any prompt from your dashboard
2. Click the "Show Run History" button
3. Browse through all previous executions
4. Click on any run to expand and see full details

### Understanding the Display

- **Status Badges**: Green (Success), Red (Error), Yellow (Timeout)
- **Timestamps**: Localized date and time of execution
- **Performance**: Execution time and token usage (when available)
- **Model**: The AI model used for the execution
- **Error Details**: Full error messages for failed executions

### Copying Responses

1. Expand any run in the history
2. Click the "Copy" button next to the response
3. The response is copied to your clipboard

## Benefits

### For Users

- **Audit Trail**: Complete record of all prompt executions
- **Performance Monitoring**: Track execution times and efficiency
- **Error Debugging**: Detailed error information for troubleshooting
- **Response Reference**: Easy access to previous AI responses
- **Usage Analytics**: Token usage tracking for cost management

### For Developers

- **Debugging**: Comprehensive logs for troubleshooting
- **Analytics**: Data for understanding usage patterns
- **Performance**: Execution time tracking for optimization
- **Reliability**: Error tracking for system health monitoring

## Technical Details

### Data Retention

- All run history is stored indefinitely
- Users can only see their own prompt run history
- Data is automatically cleaned up when prompts are deleted

### Performance Considerations

- History queries are paginated (50 records per page)
- Indexes are created for efficient querying
- Response text is stored as-is without truncation

### Security

- Row Level Security (RLS) ensures users only see their own data
- All API endpoints require authentication
- Prompt ownership is verified before allowing access

## Future Enhancements

Potential improvements for the prompt run history feature:

- **Export Functionality**: Download history as CSV/JSON
- **Advanced Filtering**: Filter by date range, status, model
- **Analytics Dashboard**: Charts and metrics for usage patterns
- **Bulk Operations**: Delete multiple history entries
- **Search**: Search through prompt text and responses
- **Integration**: Connect with external analytics tools
