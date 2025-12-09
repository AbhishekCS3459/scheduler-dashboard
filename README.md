# API Requirements for vecura Dashboard

This document lists all the APIs required to make the VC-URA Dashboard fully functional. These APIs should be implemented in the backend service layer according to the project's architecture guidelines.

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Branch Management](#branch-management)
3. [Session/Appointment Management](#sessionappointment-management)
4. [Staff Management](#staff-management)
5. [Session Types](#session-types)
6. [Branch Analytics](#branch-analytics)
7. [Patient Management](#patient-management)

---

## Authentication & User Management

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and return session/token
- **Request Body**: All authentication data associated with the user entity (e.g., email, password)
- **Response**: Authentication token and user object with all associated data


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
- **Request Body**: All data associated with the session entity
- **Response**: Created Session object with all associated data

### Update Session
- **Endpoint**: `PUT /api/sessions/:sessionId` or `PATCH /api/sessions/:sessionId`
- **Description**: Updates session details (for rescheduling or status changes)
- **Request Body**: All data associated with the session entity (or partial data for PATCH)
- **Response**: Updated Session object with all associated data

### Update Session Status
- **Endpoint**: `PATCH /api/sessions/:sessionId/status`
- **Description**: Updates only the status of a session
- **Request Body**: All data associated with the session status
- **Response**: Updated Session object with all associated data

### Update WhatsApp Status
- **Endpoint**: `PATCH /api/sessions/:sessionId/whatsapp-status`
- **Description**: Updates the WhatsApp follow-up status
- **Request Body**: All data associated with the WhatsApp status
- **Response**: Updated Session object with all associated data

### Delete Session
- **Endpoint**: `DELETE /api/sessions/:sessionId`
- **Description**: Deletes a session/appointment
- **Response**: Success confirmation

---
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
- **Description**: Updates branch settings
- **Request Body**: All data associated with the branch entity
- **Response**: Updated branch object with all associated data

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
- **Request Body**: All data associated with the staff entity
- **Response**: Created Staff object with all associated data

### Update Staff
- **Endpoint**: `PUT /api/staff/:staffId` or `PATCH /api/staff/:staffId`
- **Description**: Updates staff information
- **Request Body**: All data associated with the staff entity (or partial data for PATCH)
- **Response**: Updated Staff object with all associated data

### Update Staff Availability
- **Endpoint**: `PATCH /api/staff/:staffId/availability`
- **Description**: Updates staff availability for specific dates
- **Request Body**: All data associated with the staff availability
- **Response**: Updated Staff object with all associated data

### Update Staff Working Hours
- **Endpoint**: `PATCH /api/staff/:staffId/working-hours`
- **Description**: Updates working hours for a specific date
- **Request Body**: All data associated with the working hours
- **Response**: Updated Staff object with all associated data

### Update Staff Session Types
- **Endpoint**: `PATCH /api/staff/:staffId/session-types`
- **Description**: Updates the session types a staff member can handle
- **Request Body**: All data associated with the session types
- **Response**: Updated Staff object with all associated data

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
- **Request Body**: All data associated with the session type entity
- **Response**: Created SessionType object with all associated data

### Update Session Type
- **Endpoint**: `PUT /api/session-types/:sessionTypeId` or `PATCH /api/session-types/:sessionTypeId`
- **Description**: Updates a session type
- **Request Body**: All data associated with the session type entity (or partial data for PATCH)
- **Response**: Updated SessionType object with all associated data

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
- **Response**: Object with all data associated with daily analytics breakdown including pagination metadata

### Get All Branches Daily Analytics
- **Endpoint**: `GET /api/analytics/branches/all/daily`
- **Description**: Returns daily breakdown across all branches
- **Query Parameters**: Same as above
- **Response**: Object with all data associated with daily analytics breakdown including pagination metadata

---

## Patient Management

### Get All Patients
- **Endpoint**: `GET /api/patients`
- **Description**: Returns list of all patients
- **Query Parameters**:
  - `branchId` (optional): Filter by branch
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of results per page
- **Response**: Array of Patient objects with all associated data

### Get Patient by ID
- **Endpoint**: `GET /api/patients/:patientId`
- **Description**: Returns detailed patient information
- **Response**: Patient object with all associated data

### Search Patients
- **Endpoint**: `GET /api/patients/search`
- **Description**: Search for patients by name, phone number, or other criteria
- **Query Parameters**:
  - `q`: Search query string
  - `limit` (optional): Maximum number of results
- **Response**: Array of Patient objects with all associated data

### Create Patient
- **Endpoint**: `POST /api/patients`
- **Description**: Creates a new patient record
- **Request Body**: All data associated with the patient entity
- **Response**: Created Patient object with all associated data

### Update Patient
- **Endpoint**: `PUT /api/patients/:patientId` or `PATCH /api/patients/:patientId`
- **Description**: Updates patient information
- **Request Body**: All data associated with the patient entity (or partial data for PATCH)
- **Response**: Updated Patient object with all associated data

### Delete Patient
- **Endpoint**: `DELETE /api/patients/:patientId`
- **Description**: Deletes a patient record
- **Response**: Success confirmation

---

## Data Types Reference

### User
- Contains all data associated with a user entity (e.g., `id`, `name`, `email`, `role`, `branchId`, etc.)

### Branch
- Contains all data associated with a branch entity (e.g., `id`, `name`, `city`, `openingHours`, etc.)

### Session
- Contains all data associated with a session/appointment entity (e.g., `id`, `patientName`, `patientId`, `phone`, `therapyType`, `staffId`, `branchId`, `date`, `startTime`, `endTime`, `status`, `whatsappStatus`, `notes`, etc.)

### Staff
- Contains all data associated with a staff member entity (e.g., `id`, `name`, `gender`, `role`, `phone`, `sessionTypes`, `availability`, `branchId`, etc.)

### SessionType
- Contains all data associated with a session type entity (e.g., `id`, `name`, `durationMinutes`, etc.)

### Patient
- Contains all data associated with a patient entity (e.g., `id`, `name`, `phone`, `patientId`, `branchId`, etc.)

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

7. **File Uploads**: Support multipart/form-data or base64 encoding for file uploads when needed.

