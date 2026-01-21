export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description:
      "Simple Todo API used by the frontend. Supports CRUD operations and keyword search.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local development server",
    },
  ],
  paths: {
    "/todos": {
      get: {
        summary: "List todos",
        description:
          "Get list of todos. If a keyword is provided, returns todos whose title or description contains the keyword (case-insensitive).",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            description:
              "Keyword to search in title and description (case-insensitive).",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of todos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Todo",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create todo",
        description: "Create a new todo.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTodoInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Todo created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Todo",
                },
              },
            },
          },
          "400": {
            description: "Validation error (e.g., title is missing)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/todos/{id}": {
      get: {
        summary: "Get todo by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Todo item or null if not found",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/Todo" },
                    { type: "null" },
                  ],
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update todo",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTodoInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated todo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Todo",
                },
              },
            },
          },
          "404": {
            description: "Todo not found or invalid data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete todo",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Target todo not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Priority: {
        type: "string",
        enum: ["HIGH", "MEDIUM", "LOW"],
      },
      Todo: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          title: {
            type: "string",
            example: "Buy milk",
          },
          completed: {
            type: "boolean",
            example: false,
          },
          description: {
            type: "string",
            nullable: true,
            example: "Remember to buy low-fat milk",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-01-20T00:00:00.000Z",
          },
          priority: {
            $ref: "#/components/schemas/Priority",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
        required: ["id", "title", "completed", "priority", "createdAt", "updatedAt"],
      },
      CreateTodoInput: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          dueDate: {
            type: "string",
            description: "Date string convertible to Date (e.g., YYYY-MM-DD)",
          },
          priority: {
            $ref: "#/components/schemas/Priority",
          },
        },
        required: ["title"],
      },
      UpdateTodoInput: {
        type: "object",
        description: "Fields to update. All properties are optional.",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          dueDate: {
            type: "string",
            description: "Date string convertible to Date (e.g., YYYY-MM-DD)",
          },
          priority: {
            $ref: "#/components/schemas/Priority",
          },
          completed: {
            type: "boolean",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
          },
          details: {
            type: "string",
          },
        },
      },
    },
  },
} as const;

