# Bitespeed Backend Task: Identity Reconciliation

This is a solution for the Bitespeed Backend Task: Identity Reconciliation. The service provides an API endpoint that helps identify and keep track of a customer's identity across multiple purchases.

## Tech Stack

- Node.js with TypeScript
- Express.js for the web server
- PostgreSQL database with direct SQL queries

## Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   │   ├── config.js   # Environment variables
│   │   └── postgres.js # Database connection
│   ├── controllers/    # Request handlers
│   │   ├── contact.ts  # Contact identification logic
│   │   └── types.ts    # TypeScript type definitions
│   ├── db/             # Database related files
│   │   └── migrations/ # SQL migration scripts
│   ├── models/         # Data models
│   │   └── contact.ts  # Contact model with SQL queries
│   ├── routes/         # API routes
│   │   ├── contact.ts  # Contact routes
│   │   ├── router.js   # Express router setup
│   │   └── server.js   # Express server configuration
│   ├── utils/          # Utility functions
│   │   └── constants.ts # Application constants
│   └── index.js        # Application entry point
└── requests.http       # Sample API requests for testing
```

## API Endpoint

### `/identify`

**Method**: POST

**Request Body**:
```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

**Response**:
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["john@example.com", "john.work@example.com"],
    "phoneNumbers": ["+1234567890", "+9876543210"],
    "secondaryContactIds": [2, 3, 4]
  }
}
```

## Business Logic

The identity reconciliation service works as follows:

1. When a request is received with an email or phone number (or both), the system searches for existing contacts with matching information.

2. If no matching contacts are found, a new primary contact is created.

3. If matching contacts are found, the system determines the oldest contact (by creation date) to be the primary contact.

4. Any other contacts are linked to the primary contact as secondary contacts.

5. The response includes the primary contact ID, all associated emails and phone numbers, and IDs of any secondary contacts.

## Database Schema

The contacts table has the following structure:

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15),
    email VARCHAR(255),
    linked_id INTEGER,
    link_precedence VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (linked_id) REFERENCES contacts(id)
);
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   PORT=8080
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   DB_HOST=your_host
   DB_PORT=5432
   ```
4. Run database migrations:
   ```
   psql -U your_username -d your_database -f src/db/migrations/001_create_contacts_table.sql
   ```
5. Start the server:
   ```
   npm start
   ```

## Testing

You can test the API using the provided `requests.http` file, which contains sample requests for various scenarios. If you're using VS Code, you can install the REST Client extension to execute these requests directly from the editor.

## Implementation Details

- The application uses raw PostgreSQL queries instead of an ORM for better performance and control.
- TypeScript types are used throughout the application for type safety.
- The contact model encapsulates all database operations related to contacts.
- The controller handles the business logic for identifying and linking contacts.




The service maintains a database of contacts. When a request is received with an email or phone number, it:

1. Checks if the contact exists in the database
2. If not, creates a new primary contact
3. If it exists but with different information, creates a secondary contact linked to the primary
4. If multiple primary contacts are found to be related, consolidates them by making the oldest one the primary
5. Returns a consolidated view of the contact information

## License

ISC
