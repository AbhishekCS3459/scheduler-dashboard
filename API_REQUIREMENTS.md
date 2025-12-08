# API Requirements for VC-URA Dashboard

This document lists all the APIs required to make the VC-URA Dashboard fully functional. These APIs should be implemented in the backend service layer according to the project's architecture guidelines.

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Branch Management](#branch-management)
3. [Session/Appointment Management](#sessionappointment-management)
4. [Staff Management](#staff-management)
5. [Session Types](#session-types)
6. [Branch Analytics](#branch-analytics)
7. [Report Builder & Templates](#report-builder--templates)
8. [Report Publishing & History](#report-publishing--history)
9. [Patient Search](#patient-search)

---

## Authentication & User Management

### Get Current User
- **Endpoint**: `GET /api/auth/me` or `GET /api/users/me`
- **Description**: Returns the currently authenticated user information
- **Response**: User object with `id`, `name`, `email`, `role`, and optional `branchId`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and return session/token
- **Request Body**: `{ email: string, password: string }`
- **Response**: Authentication token and user object

---

## Branch Management

### Get All Branches
- **Endpoint**: `GET /api/branches`
- **Description**: Returns list of all branches (filtered by user role permissions)
- **Response**: Array of Branch objects with `id`, `name`, `city`, `openingHours`

### Get Branch by ID
- **Endpoint**: `GET /api/branches/:branchId`
- **Description**: Returns detailed information for a specific branch
- **Response**: Branch object

### Update Branch Settings
- **Endpoint**: `PUT /api/branches/:branchId/settings` or `PATCH /api/branches/:branchId`
- **Description**: Updates branch opening hours and settings
- **Request Body**: 
  ```json
  {
    "openingHours": {
      "Monday": { "isOpen": true, "startTime": "09:00", "endTime": "17:00" },
      "Tuesday": { "isOpen": true, "startTime": "09:00", "endTime": "17:00" },
      ...
    }
  }
  ```
- **Response**: Updated branch object

---

## Session/Appointment Management

### Get Sessions
- **Endpoint**: `GET /api/sessions`
- **Description**: Returns list of sessions/appointments with filtering capabilities
- **Query Parameters**:
  - `branchId` (optional): Filter by branch
  - `date` (optional): Filter by date (YYYY-MM-DD)
  - `staffId` (optional): Filter by staff member
  - `status` (optional): Filter by status (Planned, Completed, No-show, Conflict)
  - `gender` (optional): Filter by staff gender (M/F)
- **Response**: Array of Session objects with patient info, staff, timing, and status

### Create Session/Booking
- **Endpoint**: `POST /api/sessions`
- **Description**: Creates a new appointment/session
- **Request Body**:
  ```json
  {
    "patientName": "string",
    "patientId": "string (optional)",
    "phone": "string (optional)",
    "therapyType": "string",
    "staffId": "string",
    "branchId": "string",
    "date": "YYYY-MM-DD",
    "startTime": "HH:mm",
    "endTime": "HH:mm",
    "notes": "string (optional)"
  }
  ```
- **Response**: Created Session object

### Update Session
- **Endpoint**: `PUT /api/sessions/:sessionId` or `PATCH /api/sessions/:sessionId`
- **Description**: Updates session details (for rescheduling or status changes)
- **Request Body**: Partial Session object with fields to update
- **Response**: Updated Session object

### Update Session Status
- **Endpoint**: `PATCH /api/sessions/:sessionId/status`
- **Description**: Updates only the status of a session
- **Request Body**: 
  ```json
  {
    "status": "Planned" | "Completed" | "No-show" | "Conflict"
  }
  ```
- **Response**: Updated Session object

### Update WhatsApp Status
- **Endpoint**: `PATCH /api/sessions/:sessionId/whatsapp-status`
- **Description**: Updates the WhatsApp follow-up status
- **Request Body**: 
  ```json
  {
    "whatsappStatus": "Confirmed" | "No response" | "Cancelled"
  }
  ```
- **Response**: Updated Session object

### Delete Session
- **Endpoint**: `DELETE /api/sessions/:sessionId`
- **Description**: Deletes a session/appointment
- **Response**: Success confirmation

---

## Staff Management

### Get Staff
- **Endpoint**: `GET /api/staff`
- **Description**: Returns list of staff members
- **Query Parameters**:
  - `branchId` (optional): Filter by branch
- **Response**: Array of Staff objects with `id`, `name`, `gender`, `role`, `phone`, `sessionTypes`, `availability`, `branchId`

### Create Staff
- **Endpoint**: `POST /api/staff`
- **Description**: Adds a new staff member
- **Request Body**:
  ```json
  {
    "name": "string",
    "gender": "M" | "F",
    "role": "Therapist" | "Nutritionist" | "Coach",
    "phone": "string",
    "sessionTypes": ["string"],
    "branchId": "string",
    "availability": {}
  }
  ```
- **Response**: Created Staff object

### Update Staff
- **Endpoint**: `PUT /api/staff/:staffId` or `PATCH /api/staff/:staffId`
- **Description**: Updates staff information
- **Request Body**: Partial Staff object with fields to update
- **Response**: Updated Staff object

### Update Staff Availability
- **Endpoint**: `PATCH /api/staff/:staffId/availability`
- **Description**: Updates staff availability for specific dates
- **Request Body**:
  ```json
  {
    "date": "YYYY-MM-DD",
    "available": boolean,
    "startTime": "HH:mm (optional)",
    "endTime": "HH:mm (optional)"
  }
  ```
- **Response**: Updated Staff object

### Update Staff Working Hours
- **Endpoint**: `PATCH /api/staff/:staffId/working-hours`
- **Description**: Updates working hours for a specific date
- **Request Body**:
  ```json
  {
    "date": "YYYY-MM-DD",
    "startTime": "HH:mm",
    "endTime": "HH:mm"
  }
  ```
- **Response**: Updated Staff object

### Update Staff Session Types
- **Endpoint**: `PATCH /api/staff/:staffId/session-types`
- **Description**: Updates the session types a staff member can handle
- **Request Body**:
  ```json
  {
    "sessionTypes": ["string"]
  }
  ```
- **Response**: Updated Staff object

### Delete Staff
- **Endpoint**: `DELETE /api/staff/:staffId`
- **Description**: Deletes a staff member
- **Response**: Success confirmation

---

## Session Types

### Get Session Types
- **Endpoint**: `GET /api/session-types`
- **Description**: Returns list of available session/therapy types
- **Response**: Array of SessionType objects with `id`, `name`, `durationMinutes`

### Create Session Type
- **Endpoint**: `POST /api/session-types`
- **Description**: Creates a new session type
- **Request Body**:
  ```json
  {
    "name": "string",
    "durationMinutes": number
  }
  ```
- **Response**: Created SessionType object

### Update Session Type
- **Endpoint**: `PUT /api/session-types/:sessionTypeId` or `PATCH /api/session-types/:sessionTypeId`
- **Description**: Updates a session type
- **Request Body**: Partial SessionType object
- **Response**: Updated SessionType object

### Delete Session Type
- **Endpoint**: `DELETE /api/session-types/:sessionTypeId`
- **Description**: Deletes a session type
- **Response**: Success confirmation

---

## Branch Analytics

### Get Branch Analytics KPIs
- **Endpoint**: `GET /api/analytics/branches/:branchId/kpis`
- **Description**: Returns aggregated KPI metrics for branch analytics
- **Query Parameters**:
  - `dateRange`: "today" | "yesterday" | "week" | "custom"
  - `customDate` (optional): "YYYY-MM-DD" (required when dateRange is "custom")
- **Response**: BranchAnalyticsKpi object with:
  - `noShowRate`, `noShowCount`, `totalAppointments`
  - `followUpRate`, `followedUpCount`, `scheduledPatients`
  - `callFollowUpCount`
  - `messageResponseRate`, `messageResponseCount`, `messagesReceived`
  - `autoSchedulingRate`, `whatsappBookings`, `totalBookings`
  - `followUpToArrivalRate`

### Get All Branches Analytics KPIs
- **Endpoint**: `GET /api/analytics/branches/all/kpis`
- **Description**: Returns aggregated KPI metrics across all branches
- **Query Parameters**: Same as above
- **Response**: BranchAnalyticsKpi object (aggregated across all branches)

### Get Daily Analytics Breakdown
- **Endpoint**: `GET /api/analytics/branches/:branchId/daily`
- **Description**: Returns daily breakdown table data for analytics
- **Query Parameters**:
  - `dateRange`: "today" | "yesterday" | "week" | "custom"
  - `customDate` (optional): "YYYY-MM-DD"
  - `page` (optional): Page number for pagination
  - `rowsPerPage` (optional): Number of rows per page
- **Response**: Object with:
  ```json
  {
    "data": [
      {
        "date": "YYYY-MM-DD",
        "totalAppointments": number,
        "whatsappBookings": number,
        "noShows": number,
        "followedUp": number,
        "messageYes": number,
        "arrivalsAfterFollowUp": number
      }
    ],
    "total": number,
    "page": number,
    "rowsPerPage": number
  }
  ```

### Get All Branches Daily Analytics
- **Endpoint**: `GET /api/analytics/branches/all/daily`
- **Description**: Returns daily breakdown across all branches
- **Query Parameters**: Same as above
- **Response**: Same structure as above

---

## Report Builder & Templates

### Get Templates
- **Endpoint**: `GET /api/templates`
- **Description**: Returns list of all report templates
- **Response**: Array of Template objects with `id`, `name`, `description`, `tags`, `blocks`, `createdAt`, `lastEditedAt`

### Get Template by ID
- **Endpoint**: `GET /api/templates/:templateId`
- **Description**: Returns a specific template with all blocks
- **Response**: Template object

### Create Template
- **Endpoint**: `POST /api/templates`
- **Description**: Creates a new report template
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string (optional)",
    "tags": ["string"],
    "blocks": [
      {
        "id": "string",
        "type": "basic-info" | "inspiration-zone" | ...,
        "config": {},
        "order": number
      }
    ]
  }
  ```
- **Response**: Created Template object

### Update Template
- **Endpoint**: `PUT /api/templates/:templateId` or `PATCH /api/templates/:templateId`
- **Description**: Updates an existing template
- **Request Body**: Partial or full Template object
- **Response**: Updated Template object

### Duplicate Template
- **Endpoint**: `POST /api/templates/:templateId/duplicate`
- **Description**: Creates a copy of an existing template
- **Request Body** (optional):
  ```json
  {
    "name": "string (optional - defaults to 'Original Name (Copy)')"
  }
  ```
- **Response**: New duplicated Template object

### Delete Template
- **Endpoint**: `DELETE /api/templates/:templateId`
- **Description**: Deletes a template
- **Response**: Success confirmation

---

## Report Publishing & History

### Publish Template
- **Endpoint**: `POST /api/templates/:templateId/publish`
- **Description**: Publishes a template to patients via WhatsApp
- **Request Body**:
  ```json
  {
    "csvData": "string (base64 encoded CSV or file)",
    "variableMapping": {
      "{{variable1}}": "csv_column1",
      "{{variable2}}": "csv_column2"
    },
    "cohortTag": "string (optional)"
  }
  ```
- **Response**: Publish job object with `jobId`, `status`, `numberOfPatients`

### Get Publishing History
- **Endpoint**: `GET /api/publish/history`
- **Description**: Returns list of all template publishes
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Results per page
- **Response**: Array of PublishRecord objects with:
  - `id`, `templateName`, `publishedOn`, `numberOfPatients`
  - `cohortTag`, `status` (completed | scheduled | failed)

### Get Publish Record Details
- **Endpoint**: `GET /api/publish/history/:publishId`
- **Description**: Returns detailed information about a specific publish record
- **Response**: PublishRecord object with `patientData` array containing:
  - `id`, `name`, `reportLink`

### Get Patient Report
- **Endpoint**: `GET /api/reports/patients/:patientId/:reportId`
- **Description**: Returns a generated patient report
- **Response**: Report HTML/PDF or report data object

---

## Patient Search

### Search Patients
- **Endpoint**: `GET /api/patients/search`
- **Description**: Search for patients by name or phone number (used in booking modal)
- **Query Parameters**:
  - `q`: Search query string
  - `limit` (optional): Maximum number of results
- **Response**: Array of Patient objects with `id`, `name`, `phone`, `patientId`

### Get Patient by ID
- **Endpoint**: `GET /api/patients/:patientId`
- **Description**: Returns detailed patient information
- **Response**: Patient object

---

## Data Types Reference

### User
```typescript
{
  id: string
  name: string
  email: string
  role: "super_admin" | "branch_admin"
  branchId?: string
}
```

### Branch
```typescript
{
  id: string
  name: string
  city: string
  openingHours: {
    [day: string]: {
      isOpen: boolean
      startTime: string
      endTime: string
    }
  }
}
```

### Session
```typescript
{
  id: string
  patientName: string
  patientId: string
  phone: string
  therapyType: string
  staffId: string
  branchId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  status: "Planned" | "Completed" | "No-show" | "Conflict"
  whatsappStatus: "Confirmed" | "No response" | "Cancelled"
  notes?: string
}
```

### Staff
```typescript
{
  id: string
  name: string
  gender: "M" | "F"
  role: "Therapist" | "Nutritionist" | "Coach"
  phone: string
  sessionTypes: string[]
  availability: {
    [date: string]: {
      available: boolean
      startTime?: string
      endTime?: string
    }
  }
  branchId: string
}
```

### SessionType
```typescript
{
  id: string
  name: string
  durationMinutes: number
}
```

### Template
```typescript
{
  id: string
  name: string
  description: string
  tags: string[]
  blocks: Block[]
  createdAt: Date
  lastEditedAt: Date
  layoutType?: "predefined" | "custom"
}
```

### Block
```typescript
{
  id: string
  type: BlockType
  config: Record<string, any>
  order: number
}
```

---

## Notes

1. **Authentication**: All API endpoints (except login) should require authentication. Include authentication token in request headers (e.g., `Authorization: Bearer <token>`).

2. **Authorization**: Implement role-based access control:
   - `super_admin`: Can access all branches and all data
   - `branch_admin`: Can only access data for their assigned branch

3. **Error Handling**: All APIs should return appropriate HTTP status codes and error messages:
   - `200 OK`: Success
   - `201 Created`: Resource created successfully
   - `400 Bad Request`: Invalid request data
   - `401 Unauthorized`: Authentication required
   - `403 Forbidden`: Insufficient permissions
   - `404 Not Found`: Resource not found
   - `500 Internal Server Error`: Server error

4. **Pagination**: Endpoints returning lists should support pagination with `page` and `limit` query parameters.

5. **Filtering & Sorting**: List endpoints should support filtering and sorting where applicable.

6. **Date Formats**: Use ISO 8601 date format (YYYY-MM-DD) for dates and HH:mm for times.

7. **File Uploads**: For CSV upload in template publishing, support multipart/form-data or base64 encoding.

---

## Implementation Priority

### Phase 1 (Core Functionality)
1. Authentication & User Management
2. Branch Management
3. Session/Appointment Management
4. Staff Management
5. Session Types

### Phase 2 (Analytics & Reports)
6. Branch Analytics
7. Report Builder & Templates
8. Report Publishing & History

### Phase 3 (Enhancements)
9. Patient Search
10. Additional filtering and search capabilities

---

## Integration Notes

- All API endpoints should follow RESTful conventions
- Use the auto-generated API client from OpenAPI specs when available (see `api-client/` folder)
- Implement service layer files in `services/` folder that use the API client
- Keep data transformation logic in `utils/` folder
- Ensure proper error handling and response management in service layer

